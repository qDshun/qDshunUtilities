import { DragDropModule } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, inject, computed, WritableSignal, signal, ViewChild, AfterViewInit, effect, Signal, ViewChildren } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatTree, MatTreeModule } from "@angular/material/tree";
import { AnyWorldObject, TreeNode, TreeService } from "../../../services/tree-service";
import { WorldObjectService } from "../../../services/world-object.service";
import { MatButtonModule } from "@angular/material/button";
import { WorldObjectComponent } from "../world-object/world-object.component";
import { WorldObject } from "../../../models/world-object.model";

@Component({
  selector: 'app-world-object-list',
  standalone: true,
  imports: [CommonModule, DragDropModule, MatTreeModule, MatIconModule, MatButtonModule, WorldObjectComponent],
  templateUrl: './world-object-list.component.html',
  styleUrl: './world-object-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorldObjectListComponent implements AfterViewInit {
  @ViewChild('tree') tree!: MatTree<TreeNode<WorldObject>>;

  @ViewChildren('mat-tree-node') nodes!: any;
  private treeService = inject(TreeService);
  private worldObjectService = inject(WorldObjectService);

  private lock = false;
  public draggedWorldObjectId!: string;
  public previewedWorldObjectIndex: number = -1;
  public previewedWorldObjectId!: string;
  private draggedWorldObject: WritableSignal<WorldObject | null> = signal(null);
  private dragAndDropMoveType: WritableSignal<'before' | 'after'> = signal('before');

  private linkedWorldObjects: WritableSignal<AnyWorldObject[]> = signal([]);

  private DEBUG_LENGTH = computed(() => this.linkedWorldObjects().length);
  treeData: Signal<TreeNode<AnyWorldObject>[]> = computed(() => this.treeService.toTree(this.linkedWorldObjects()));

  constructor() {
    effect(() => this.linkedWorldObjects.set([...this.worldObjectService.worldObjects()]), { allowSignalWrites: true });
  }

  ngAfterViewInit(): void {
    this.tree.isExpanded = () => true;
    this.tree.expandAll();
  }

  handleDragStart(event: DragEvent, node: TreeNode<WorldObject>) {
    this.draggedWorldObjectId = node.value.id;
    this.draggedWorldObject.set(node.value);

    event.dataTransfer!.effectAllowed = "copyMove";
  }

  onDrop(event: DragEvent, node: TreeNode<WorldObject>) {
    const lwos = this.linkedWorldObjects();
    const dwo = this.draggedWorldObject();
    if (!dwo) {
      return;
    }
    const previewItem = lwos[this.previewedWorldObjectIndex];
    lwos.splice(this.previewedWorldObjectIndex, 1);

    dwo.path.set(previewItem.path());
    this.linkedWorldObjects.set([...lwos]);

    this.draggedWorldObjectId = null!;
    this.previewedWorldObjectId = null!;
    this.draggedWorldObject.set(null);
    this.previewedWorldObjectIndex = -1;
  }

  private getPreviewId(id: string) {
    return `preview-${id}`;
  }

  onDragEnd(event: DragEvent) {
    event.preventDefault();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onItemDragEnter(event: DragEvent, node: TreeNode<AnyWorldObject>) {
    event.preventDefault();
    if (this.lock) {
      return;
    }
    this.lock = true;
    this.dragAndDropMoveType.set(event.offsetY < 20 ? 'before' : 'after');

    const moveType = this.dragAndDropMoveType();
    const lwos = this.linkedWorldObjects();
    const targetWorldObjectIndex = lwos.findIndex(lwo => lwo == node.value);
    let indexOfDraggedWorldObject = lwos.findIndex(lwo => lwo.id == this.draggedWorldObjectId);
    const newIndex = moveType == 'before' ? targetWorldObjectIndex : targetWorldObjectIndex + 1;

    if (targetWorldObjectIndex == -1) {
      this.lock = false;
      return;
    }

    if (indexOfDraggedWorldObject == -1) {
      this.lock = false;
      return;
    }
    if (targetWorldObjectIndex == indexOfDraggedWorldObject) {
      this.lock = false;
      return;
    }
    const isInsertOnly = this.previewedWorldObjectIndex == -1;

    event.dataTransfer!.dropEffect = 'move';

    if (newIndex == this.previewedWorldObjectIndex) {
      this.lock = false;
      return;
    }

    if (!isInsertOnly) {
      lwos.splice(this.previewedWorldObjectIndex, 1);
      this.linkedWorldObjects.set([...lwos]);
      if (this.previewedWorldObjectIndex < indexOfDraggedWorldObject) {
        indexOfDraggedWorldObject -= 1;
      }
    }

    const draggedWorldObject = lwos[indexOfDraggedWorldObject];
    const draggedWorldObjectCopy = draggedWorldObject.Copy(this.getPreviewId(draggedWorldObject.id));


    const newPath = this.isFolder(0, node) && this.tree.isExpanded(node) && moveType == 'after' ? node.value.fullPath : node.value.path();
    draggedWorldObjectCopy.path.set(newPath);

    //inserting item;
    this.previewedWorldObjectId = draggedWorldObjectCopy.id;

    lwos.splice(newIndex, 0, draggedWorldObjectCopy);
    this.previewedWorldObjectIndex = newIndex;


    this.linkedWorldObjects.set([...lwos]);
    this.lock = false;
    return;
  }

  childrenAccessor = (node: TreeNode<WorldObject>) => node.children ?? [];

  hasChild = (_: number, node: TreeNode<WorldObject>) => !!node.children && node.children.length > 0;
  isFolder = (_: number, node: TreeNode<WorldObject>) => node.value.type == 'folder';



  private moveTo(arr: any[], fromIndex: number, toIndex: number) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
  }
}

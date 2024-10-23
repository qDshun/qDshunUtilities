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
import { fromEvent, Subject, takeUntil } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

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
  public previewedWorldObjectId!: string;
  private draggedWorldObject: WritableSignal<WorldObject | null> = signal(null);
  private dragAndDropMoveType: WritableSignal<'before' | 'after'> = signal('before');

  private linkedWorldObjects: WritableSignal<AnyWorldObject[]> = signal([]);

  private DEBUG_LENGTH = computed(() => this.linkedWorldObjects().length);
  treeData: Signal<TreeNode<AnyWorldObject>[]> = computed(() => this.treeService.toTree(this.linkedWorldObjects()));
  dragEndUnsubscribe$ = new Subject<void>();

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

    fromEvent<DragEvent>(event.target!, 'dragend').pipe(
      takeUntil(this.dragEndUnsubscribe$)
    ).subscribe((e) => this.handleDragEnd(e));
  }

  handleDragEnd(event: DragEvent) {
    event.preventDefault();
    const lwos = this.linkedWorldObjects();
    const dwo = this.draggedWorldObject();
    if (!dwo) {
      return;
    }
    const previewItem = lwos.find(lwo => lwo.id.startsWith('preview'))!;
    const previewItemIndex = lwos.findIndex(lwo => lwo.id.startsWith('preview'))!;
    lwos.splice(previewItemIndex, 1);

    if (event.dataTransfer?.dropEffect != 'none') {
      dwo.path.set(previewItem.path());
    }

    this.linkedWorldObjects.set([...lwos]);

    this.draggedWorldObjectId = null!;
    this.previewedWorldObjectId = null!;
    this.draggedWorldObject.set(null);

    this.dragEndUnsubscribe$.next();
    this.dragEndUnsubscribe$.complete();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
  }

  onItemDragEnter(event: DragEvent, node: TreeNode<AnyWorldObject>) {
    if (this.lock) {
      return;
    }
    event.preventDefault();
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

    if (targetWorldObjectIndex == indexOfDraggedWorldObject) {
      this.lock = false;
      return;
    }

    event.dataTransfer!.dropEffect = 'move';

    const previewItems = lwos.filter(lwo => lwo.id.startsWith('preview'));
    previewItems.forEach(previewObject => {
      const index = lwos.findIndex(lwo => lwo == previewObject);
      if (index < indexOfDraggedWorldObject) {
        indexOfDraggedWorldObject -= 1;
      }
      lwos.splice(index, 1);
      this.linkedWorldObjects.set([...lwos]);
    });

    const draggedWorldObject = lwos[indexOfDraggedWorldObject];
    const draggedWorldObjectCopy = draggedWorldObject.Copy(this.getPreviewId(draggedWorldObject.id));

    const newPath = this.isFolder(0, node) && this.tree.isExpanded(node) && moveType == 'after' ? node.value.fullPath : node.value.path();
    draggedWorldObjectCopy.path.set(newPath);

    //inserting item;
    this.previewedWorldObjectId = draggedWorldObjectCopy.id;

    lwos.splice(newIndex, 0, draggedWorldObjectCopy);

    this.linkedWorldObjects.set([...lwos]);
    this.lock = false;
    return;
  }

  private getPreviewId(id: string) {
    return `preview-${id}`;
  }

  childrenAccessor = (node: TreeNode<WorldObject>) => node.children ?? [];

  hasChild = (_: number, node: TreeNode<WorldObject>) => !!node.children && node.children.length > 0;
  isFolder = (_: number, node: TreeNode<WorldObject>) => node.value.type == 'folder';

}

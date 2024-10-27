import { DragDropModule } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, inject, WritableSignal, signal, ViewChild, effect, ViewChildren, untracked } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatTree, MatTreeModule } from "@angular/material/tree";
import { WorldObjectService } from "../../../services/world-object.service";
import { MatButtonModule } from "@angular/material/button";
import { WorldObjectComponent } from "../world-object/world-object.component";
import { AnyWorldObject } from "../../../models/world-object.model";
import { fromEvent, Subject, takeUntil } from "rxjs";
import { CdkTreeModule } from "@angular/cdk/tree";

@Component({
  selector: 'app-world-object-list',
  standalone: true,
  imports: [CommonModule, DragDropModule, MatTreeModule, CdkTreeModule, MatIconModule, MatButtonModule, WorldObjectComponent],
  templateUrl: './world-object-list.component.html',
  styleUrl: './world-object-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorldObjectListComponent {
  @ViewChild('tree') tree!: MatTree<AnyWorldObject>;

  @ViewChildren('mat-tree-node') nodes!: any;
  private worldObjectService = inject(WorldObjectService);
  dragEndUnsubscribe$!: Subject<void>;


  private insertionStrategy: WritableSignal<'before' | 'after' | 'same-level' | 'drop-to-canvas'> = signal('before');
  private readonly nodePaddingInPx = 20;
  private readonly nodeHeightInPx = 40;

  public targetWorldObject: WritableSignal<AnyWorldObject | null> = signal(null!);
  public previewedWorldObject: WritableSignal<AnyWorldObject | null> = signal(null!);
  public draggedWorldObject: WritableSignal<AnyWorldObject | null> = signal(null!);

  public linkedWorldObjects: WritableSignal<AnyWorldObject[]> = signal([]);

  constructor() {
    effect(() => this.refreshLinkedStateFromSource(), { allowSignalWrites: true });
    effect(() => this.onDragStateChanged(), { allowSignalWrites: true });
  }

  private getPreviewId(id: string) {
    return `preview-${id}`;
  }

  onDragStart(event: DragEvent, node: AnyWorldObject) {
    event.dataTransfer!.effectAllowed = "copyMove";
    this.dragEndUnsubscribe$ = new Subject<void>();
    this.previewedWorldObject.set(node.Copy(this.getPreviewId(node.id)));
    this.draggedWorldObject.set(node);

    if (this.isFolder(0, node) && this.tree.isExpanded(node)){
      this.tree.collapse(node);
    }

    fromEvent<DragEvent>(event.target!, 'dragend').pipe(
      takeUntil(this.dragEndUnsubscribe$)
    ).subscribe((e) => this.onDragEnd(e));
  }

  onDragEnd(event: DragEvent) {
    event.preventDefault();
    const previewedWorldObject = this.previewedWorldObject()!;
    if (this.isDropSuccessfull(event) && !this.isSameLocation(previewedWorldObject)) {
      const lwos = untracked(() => this.linkedWorldObjects());
      const originalObjects = this.worldObjectService.worldObjects()

      const maybeAffectedNode = lwos.find(lwo => lwo.previousId() == previewedWorldObject?.id);
      const originalOfPreview = originalObjects.find(oo => oo.id == this.draggedWorldObject()?.id)!;

      const originalOfAffected = originalObjects.find(oo => oo.id == maybeAffectedNode?.id);

      originalOfPreview.parentId.set(previewedWorldObject.parentId());
      originalOfPreview.previousId.set(previewedWorldObject.previousId());

      if (originalOfAffected && maybeAffectedNode){
        originalOfAffected.parentId.set(maybeAffectedNode.parentId());
        originalOfAffected.previousId.set(originalOfPreview.id);
      }


      const copyOfNextToDragged = lwos.find(oo => oo.previousId() == this.draggedWorldObject()?.id);
      const originalOfNextToDragged = originalObjects.find(oo => oo.id == copyOfNextToDragged?.id);

      if (originalOfNextToDragged && copyOfNextToDragged){
        originalOfNextToDragged.previousId.set(this.draggedWorldObject()?.previousId());
      }
    }

    this.previewedWorldObject.set(null);
    this.draggedWorldObject.set(null);
    this.targetWorldObject.set(null);

    this.dragEndUnsubscribe$.next();
    this.dragEndUnsubscribe$.complete();
    this.refreshLinkedStateFromSource();
  }

  onDragEnter(event: DragEvent, node: AnyWorldObject) {
    event.preventDefault();
    if (this.targetWorldObject()?.id == node.id || node.id.includes('preview')){
      event.stopImmediatePropagation();
      return;
    }
    this.targetWorldObject.set(node);
  }

  onDragOver(event: DragEvent, node: AnyWorldObject) {
    event.preventDefault();
    event.stopPropagation();
    if (this.draggedWorldObject()?.id == node.id){
      return;
    }
    if (event.offsetY <= this.nodeHeightInPx / 3){
      this.insertionStrategy.set('before');
    }
    if  (event.offsetY >= 2 * this.nodeHeightInPx / 3){
      this.insertionStrategy.set('after');
    }
  }

  onDragStateChanged(){
    //TODO: Add support for dropping inside of folder, maybe expanding folders?
    const insertionStrategy = this.insertionStrategy();
    const previewedWorldObject = untracked(() => this.previewedWorldObject());
    const draggedWorldObject = untracked(() => this.draggedWorldObject());

    if (!previewedWorldObject || !draggedWorldObject){
      return;
    }

    untracked(() => this.refreshLinkedStateFromSource());
    const lwos = untracked(() => this.linkedWorldObjects());
    untracked(() => {

      const targetWorldObject = lwos.find(lwo => lwo.id == this.targetWorldObject()?.id)!;
      const parentWorldObject = lwos.find(lwo => lwo.id == targetWorldObject.parentId());
      const previousNodeOfTarget = lwos.find(lwo => lwo.id == targetWorldObject.previousId());
      const nextNodeOfTarget = lwos.find(lwo => lwo.previousId() == targetWorldObject.id);


      if (insertionStrategy == 'before'){
        previewedWorldObject.parentId.set(parentWorldObject?.id);

        previewedWorldObject.previousId.set(previousNodeOfTarget?.id);
        targetWorldObject.previousId.set(previewedWorldObject.id);
      }

      if (insertionStrategy == 'after'){
        previewedWorldObject.parentId.set(parentWorldObject?.id);

        previewedWorldObject.previousId.set(targetWorldObject.id);
        nextNodeOfTarget?.previousId.set(previewedWorldObject.id);
      }
    });
    this.linkedWorldObjects.update(lwos => [...lwos, previewedWorldObject]);
  }

  childrenAccessor = (node: AnyWorldObject) => this.childrenAccessorById(node.id);

  childrenAccessorById = (nodeId: string | undefined) => {
    const children = this.linkedWorldObjects().filter(lwo => lwo.parentId() == nodeId);
    let previousId: string  | undefined = undefined;

    const sortedChildren = [];
    for (let i = 0; i<children.length; i++){
      const nextChild = children.find(c => c.previousId() == previousId);
      if (!nextChild){
        continue;
      }
      sortedChildren.push(nextChild);
      previousId = nextChild?.id;

    }
    return sortedChildren;
  };


  getPadding(node: AnyWorldObject){
    const depth = this.tree._getLevel(node) ?? 0;
    return `${this.nodePaddingInPx * depth}px`
  }

  hasChild = (_: number, node: AnyWorldObject) => this.childrenAccessor(node).length > 0;
  isFolder = (_: number, node: AnyWorldObject) => node.type == 'folder';

  private isDropSuccessfull(event: DragEvent){
    return event.dataTransfer?.dropEffect != 'none';
  }

  private isSameLocation(preview: AnyWorldObject){
    const draggedWorldObject = this.draggedWorldObject();
    return !draggedWorldObject
    || preview.previousId() == draggedWorldObject.id
    || preview.id == draggedWorldObject.previousId()
    || preview.previousId() == draggedWorldObject.previousId();
  }

  private refreshLinkedStateFromSource(){
    const lwos = untracked(() => this.linkedWorldObjects());
    const expandedFolderIds = lwos.filter(lwo => this.isFolder(0, lwo) && this.tree.isExpanded(lwo)).map(lwo => lwo.id);
    const worldObjectsCopy = this.getWorldObjectsCopy()
    this.linkedWorldObjects.set(worldObjectsCopy);

    expandedFolderIds.forEach(id => {
      const folderToExapnd = worldObjectsCopy.find(woc => woc.id == id);
      if (folderToExapnd){
        this.tree.expand(folderToExapnd);
      }
    });
  }

  private getWorldObjectsCopy(){
    const worldObjects = this.worldObjectService.worldObjects();
    return untracked(() => worldObjects.map(wo => wo.Copy(wo.id)));
  }
}

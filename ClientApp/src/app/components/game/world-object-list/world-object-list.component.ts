import { DragDropModule } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, inject, computed } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatTreeModule } from "@angular/material/tree";
import { map } from "rxjs";
import { TreeService, NamedTreeNode } from "../../../services/tree-service";
import { WorldObjectService } from "../../../services/world-object.service";
import { MatButtonModule } from "@angular/material/button";
import { WorldObjectComponent } from "../world-object/world-object.component";
import { WorldObjectResponse } from "../../../models/response/world-object-response";
import { WorldObject } from "../../../models/world-object.model";

@Component({
  selector: 'app-world-object-list',
  standalone: true,
  imports: [CommonModule, DragDropModule, MatTreeModule, MatIconModule, MatButtonModule, WorldObjectComponent],
  templateUrl: './world-object-list.component.html',
  styleUrl: './world-object-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorldObjectListComponent {

  handleDragStart(event: DragEvent, node: NamedTreeNode<WorldObject>) {
    // let img = new Image();
    // img.src = node.value!.url;
    // img.width = 40;
    // img.height = 40;
    // event.dataTransfer?.setDragImage(img, 10, 10);
  }

  handleDragEnter(event: DragEvent) {
    console.log('handleDragEnter')
    event.preventDefault();
  }

  handleDragOver(event: DragEvent) {
    console.log('handleDragOver')
    event.preventDefault();
  }

  handleDrop(event: DragEvent, node: NamedTreeNode<WorldObject>) {
    console.log('handleDrop')
  }

  handleDragEnd(event: DragEvent, node: NamedTreeNode<WorldObject>) {
    console.log('handleDragEnd')
  }

  private treeService = inject(TreeService);
  private worldObjectService = inject(WorldObjectService);

  treeData = computed(() => this.treeService.toTree(this.worldObjectService.worldObjects()));

  childrenAccessor = (node: NamedTreeNode<WorldObject>) => node.children ?? [];

  hasChild = (_: number, node: NamedTreeNode<WorldObject>) => !!node.children && node.children.length > 0;
}

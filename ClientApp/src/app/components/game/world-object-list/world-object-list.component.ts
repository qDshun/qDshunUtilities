import { DragDropModule } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, inject } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatTreeModule } from "@angular/material/tree";
import { map } from "rxjs";
import { TreeService, NamedTreeNode } from "../../../services/tree-service";
import { WorldObjectService } from "../../../services/world-object.service";
import { MatButtonModule } from "@angular/material/button";
import { WorldObjectComponent } from "../world-object/world-object.component";
import { WorldObjectResponse } from "../../../models/world-object-response";

@Component({
  selector: 'app-world-object-list',
  standalone: true,
  imports: [CommonModule, DragDropModule, MatTreeModule, MatIconModule, MatButtonModule, WorldObjectComponent],
  templateUrl: './world-object-list.component.html',
  styleUrl: './world-object-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorldObjectListComponent {
  private treeService = inject(TreeService);
  private worldObjectService = inject(WorldObjectService);
  worldObjects$ = this.worldObjectService.worldsOrbjects$

  treeData$ = this.worldObjects$.pipe(
    map(worldObjects => this.treeService.toTree(worldObjects)),
  )

  toggleFavourite(worldObjectNode: NamedTreeNode<WorldObjectResponse>): void {
    if (!worldObjectNode?.value) {
      return;
    };

    this.worldObjectService.toggleFavourite(worldObjectNode.value.id);
  }

  childrenAccessor = (node: NamedTreeNode<WorldObjectResponse>) => node.children ?? [];

  hasChild = (_: number, node: NamedTreeNode<WorldObjectResponse>) => !!node.children && node.children.length > 0;
}

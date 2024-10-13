import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { NamedTreeNode } from '../../../services/tree-service';
import { WorldObjectResponse } from '../../../models';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WorldObjectService } from '../../../services/world-object.service';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-world-object[worldObjectNode]',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './world-object.component.html',
  styleUrl: './world-object.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorldObjectComponent implements OnInit{
  @Input() worldObjectNode!: NamedTreeNode<WorldObjectResponse>;
  worldObjectService = inject(WorldObjectService);

  favouriteIconStyle$ = this.worldObjectService.favouriteUpdated$.pipe(
    map(favouriteIds => this.getStyle(this.worldObjectNode, favouriteIds))
  )

  ngOnInit(): void {
      console.log(this.worldObjectNode)
  }

  private getStyle(node: NamedTreeNode<WorldObjectResponse>, favouriteIds: string[]){
    const isFavourite = this.worldObjectNode.value ? favouriteIds.includes(this.worldObjectNode.value.id) : false;
    return `fill: ${isFavourite ? 'yellow' : 'rgb(95, 99, 104)'}`;
  }
}

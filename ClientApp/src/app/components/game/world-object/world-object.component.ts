import { ChangeDetectionStrategy, Component, computed, inject, Input, OnInit } from '@angular/core';
import { NamedTreeNode } from '../../../services/tree-service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WorldObjectService } from '../../../services/world-object.service';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { WorldObjectResponse } from '../../../models/response/world-object-response';
import { WorldObject } from '../../../models/world-object.model';

@Component({
  selector: 'app-world-object[worldObjectNode]',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './world-object.component.html',
  styleUrl: './world-object.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorldObjectComponent implements OnInit{
  @Input() worldObjectNode!: NamedTreeNode<WorldObject>;
  public isFavouriteStyle = computed(() => `fill: ${this.worldObjectNode.value?.isFavourite() ? 'yellow' : 'rgb(95, 99, 104)'}`);
  public backgroundImageStyle = computed(() =>
    `background: linear-gradient(rgba(35, 36, 39, 0.4), rgba(35, 36, 39, 0.4)), url('${this.worldObjectNode.value?.url()}');
     background-position: center center; background-size: cover;`);

  toggleFavourite(worldObjectNode: NamedTreeNode<WorldObject>): void {
    worldObjectNode.value?.isFavourite.update(isFavourite => !isFavourite);
  }

  ngOnInit(): void {

  }
}

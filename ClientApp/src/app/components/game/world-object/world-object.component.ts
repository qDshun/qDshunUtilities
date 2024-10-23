import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, HostBinding, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { WorldObjectItem } from '../../../models/world-object.model';
import { TreeNode } from '../../../services/tree-service';

@Component({
  selector: 'app-world-object[worldObjectNode][dragged][preview]',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './world-object.component.html',
  styleUrl: './world-object.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorldObjectComponent implements OnInit {
  @Input() worldObjectNode!: TreeNode<WorldObjectItem>;
  @Input() dragged!: boolean;
  @Input() preview!: boolean;
  @HostBinding('style.opacity') get opacity() { return this.dragged ? 0.5 : 1 }
  @HostBinding('style.background') get color() { return this.preview ? 'red' : 'unset' }
  changeDetecrotRef = inject(ChangeDetectorRef);

  public isFavouriteStyle = computed(() => `fill: ${this.worldObjectNode.value?.isFavourite() ? 'yellow' : 'rgb(95, 99, 104)'}`);
  public backgroundImageStyle = computed(() =>
    `background: linear-gradient(rgba(35, 36, 39, 0.4), rgba(35, 36, 39, 0.4)), url('${this.worldObjectNode.value?.url()}');
     background-position: center center; background-size: cover;`);

  toggleFavourite(worldObjectNode: TreeNode<WorldObjectItem>): void {
    worldObjectNode.value?.isFavourite.update(isFavourite => !isFavourite);
  }

  ngOnInit(): void {

  }
}

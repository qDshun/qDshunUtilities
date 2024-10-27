import { ChangeDetectionStrategy, Component, computed, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { WorldObjectItem } from '../../../models/world-object.model';

@Component({
  selector: 'app-world-object[worldObjectNode]',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './world-object.component.html',
  styleUrl: './world-object.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorldObjectComponent {
  @Input() worldObjectNode!: WorldObjectItem;

  public isFavouriteStyle = computed(() => `fill: ${this.worldObjectNode.isFavourite() ? 'yellow' : 'rgb(95, 99, 104)'}`);
  public backgroundImageStyle = computed(() =>
    `background: linear-gradient(rgba(35, 36, 39, 0.4), rgba(35, 36, 39, 0.4)), url('${this.worldObjectNode.url()}');
     background-position: center center; background-size: cover;`);

  toggleFavourite(worldObjectNode: WorldObjectItem): void {
    worldObjectNode.isFavourite.update(isFavourite => !isFavourite);
  }

}

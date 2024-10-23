import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { WorldObjectService } from '../../../services/world-object.service';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { PathToNamePipe } from '../../../helpers/path-to-name.pipe';
import { WorldObjectItem } from '../../../models/world-object.model';

@Component({
  selector: 'app-game-bar-quick-access',
  standalone: true,
  imports: [CommonModule, DragDropModule, PathToNamePipe],
  templateUrl: './game-bar-quick-access.component.html',
  styleUrl: './game-bar-quick-access.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameBarQuickAccessComponent {
  private worldObjectService = inject(WorldObjectService);
  public favouriteWorldObjects = computed(() => this.worldObjectService.worldObjects().filter(wo => wo.type == 'item' && (wo as WorldObjectItem).isFavourite()))

  drop(event: CdkDragDrop<string[]>, array: any[]) {
    moveItemInArray(array, event.previousIndex, event.currentIndex);
  }
}

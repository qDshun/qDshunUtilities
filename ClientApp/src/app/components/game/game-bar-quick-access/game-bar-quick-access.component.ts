import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WorldObjectService } from '../../../services/world-object.service';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { PathToNamePipe } from '../../../helpers';

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
  favouriteWorldObjects$ = this.worldObjectService.favouriteWorldObjects$;


  drop(event: CdkDragDrop<string[]>, array: any[]) {
    moveItemInArray(array, event.previousIndex, event.currentIndex);
  }
}

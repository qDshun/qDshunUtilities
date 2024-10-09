import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WorldObjectService } from '../../../services/world-object.service';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-game-bar-quick-access',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './game-bar-quick-access.component.html',
  styleUrl: './game-bar-quick-access.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameBarQuickAccessComponent {
  worldObjectService = inject(WorldObjectService);
  worldObjects$ = this.worldObjectService.worldsOrbjects$;

  drop(event: CdkDragDrop<string[]>, array: any[]) {
    moveItemInArray(array, event.previousIndex, event.currentIndex);
  }
}

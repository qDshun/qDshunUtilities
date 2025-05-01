import { DragDropModule, CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, inject, computed } from "@angular/core";
import { WorldObjectItem } from "@models/business";
import { WorldObjectService } from "@services";

@Component({
  selector: 'app-game-bar-quick-access',
  standalone: true,
  imports: [CommonModule, DragDropModule],
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

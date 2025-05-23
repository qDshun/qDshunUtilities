import { DragDropModule, CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, inject, computed } from "@angular/core";
import { WorldObjectCharacter, WorldObjectType } from "@models/business";
import { FavouritesService, StateService } from "@services";

@Component({
  selector: 'app-game-bar-quick-access',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './game-bar-quick-access.component.html',
  styleUrl: './game-bar-quick-access.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameBarQuickAccessComponent {
  private stateService = inject(StateService);
  public favouriteWorldObjects = computed(() => this.stateService.worldObjects().filter(wo => wo.type == WorldObjectType.CharacterSheet && (wo as WorldObjectCharacter).isFavourite()))

  drop(event: CdkDragDrop<string[]>, array: any[]) {
    moveItemInArray(array, event.previousIndex, event.currentIndex);
  }
}

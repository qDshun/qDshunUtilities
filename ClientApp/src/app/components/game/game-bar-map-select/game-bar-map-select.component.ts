import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, WritableSignal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { GameMap } from '@models/business';
import { StateService } from '@services';
import { map, tap } from 'rxjs';

@Component({
  selector: 'app-game-bar-map-select',
  standalone: true,
  imports: [MatCardModule, MatTabsModule, MatRippleModule, CommonModule],
  templateUrl: './game-bar-map-select.component.html',
  styleUrl: './game-bar-map-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameBarMapSelectComponent {
  private readonly stateService = inject(StateService);

  public maps!: WritableSignal<GameMap[]>;

  public readonly mapsReady$ = this.stateService.ready$.pipe(
    tap(() => this.maps = this.stateService.maps),
    map(() => true),
  );


  onSelectedTabIndexChange(event: number) {
    this.switchToMap(this.maps()[event]);
  }

  private switchToMap(map: GameMap) {
    this.stateService.changeMap(map.id);
  }
}

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { GameMap } from '@models/business';
import { StateService } from '@services';
import { map } from 'rxjs';

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
  public readonly stateServiceReady$ = this.stateService.ready$.pipe(
    map(() => true)
  );

  public readonly maps = this.stateService.maps;

  onSelectedTabIndexChange(event: number) {
    this.switchToMap(this.maps()[event]);
  }

  private switchToMap(map: GameMap) {
    this.stateService.changeMap(map.id);
  }
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { GameMap, StateService } from '../../../services/state.service';

@Component({
  selector: 'app-game-bar-map-select',
  standalone: true,
  imports: [MatCardModule, MatTabsModule, MatRippleModule],
  templateUrl: './game-bar-map-select.component.html',
  styleUrl: './game-bar-map-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameBarMapSelectComponent {
  private stateService = inject(StateService);
  public maps = this.stateService.maps;
  activeLink = "";

  onSelectedTabIndexChange(event: number) {
    this.switchToMap(this.maps()[event]);
  }

  private switchToMap(map: GameMap) {
    this.stateService.changeMap(map.id);
  }
}

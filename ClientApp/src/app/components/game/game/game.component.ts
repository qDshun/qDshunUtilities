import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GameBarRightComponent } from "../game-bar-right/game-bar-right.component";
import { GameBarToolsComponent } from "../game-bar-tools/game-bar-tools.component";
import { GameBarQuickAccessComponent } from "../game-bar-quick-access/game-bar-quick-access.component";
import { GameScreenComponent } from "../game-screen/game-screen.component";
import { GameBarMapSelectComponent } from "../game-bar-map-select/game-bar-map-select.component";

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [GameBarRightComponent, GameBarToolsComponent, GameBarQuickAccessComponent, GameScreenComponent, GameBarMapSelectComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent {

}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GameBarRightComponent } from "../game-bar-right/game-bar-right.component";
import { GameBarToolsComponent } from "../game-bar-tools/game-bar-tools.component";
import { GameBarQuickAccessComponent } from "../game-bar-quick-access/game-bar-quick-access.component";
import { GameScreenComponent } from "../game-screen/game-screen.component";
import { GameBarMapSelectComponent } from "../game-bar-map-select/game-bar-map-select.component";
import { RenderService } from '../../../services/render.service';
import { StateService } from '../../../services/state.service';
import { ViewService } from '../../../services/view.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [GameBarRightComponent, GameBarToolsComponent, GameBarQuickAccessComponent, GameScreenComponent, GameBarMapSelectComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RenderService, StateService, ViewService]
  // Using providers, combined with providedIn: GameComponent, to create a new copy each time component is loaded, since that services should be local per-game
})
export class GameComponent {

}

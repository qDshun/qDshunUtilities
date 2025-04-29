import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GameBarRightComponent } from "../game-bar-right/game-bar-right.component";
import { GameBarToolsComponent } from "../game-bar-tools/game-bar-tools.component";
import { GameBarQuickAccessComponent } from "../game-bar-quick-access/game-bar-quick-access.component";
import { GameScreenComponent } from "../game-screen/game-screen.component";
import { GameBarMapSelectComponent } from "../game-bar-map-select/game-bar-map-select.component";
import { GameService } from '../../../services/game.service';
import { StateService } from '../../../services/state.service';
import { ViewService } from '../../../services/view.service';
import { MapRenderingSubsystem } from '../../../services/game/subsystems/map-rendering.subsystem';
import { LayerRenderingSubsystem } from '../../../services/game/subsystems/layer-rendering.subsystem';
import { TokenRenderingSubsystem } from '../../../services/game/subsystems/token-rendering.subsystem';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [GameBarRightComponent, GameBarToolsComponent, GameBarQuickAccessComponent, GameScreenComponent, GameBarMapSelectComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [GameService, StateService, ViewService, MapRenderingSubsystem, LayerRenderingSubsystem, TokenRenderingSubsystem]
  // Using providers, combined with providedIn: GameComponent, to create a new copy each time component is loaded, since that services should be local per-game
})
export class GameComponent {

}

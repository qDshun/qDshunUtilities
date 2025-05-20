import { Component, ChangeDetectionStrategy } from "@angular/core";
import { GameService, MapApiService, StateService, ViewService, WorldObjectApiService } from "@services";
import { GameBarMapSelectComponent } from "../game-bar-map-select/game-bar-map-select.component";
import { GameBarQuickAccessComponent } from "../game-bar-quick-access/game-bar-quick-access.component";
import { GameBarRightComponent } from "../game-bar-right/game-bar-right.component";
import { GameBarToolsComponent } from "../game-bar-tools/game-bar-tools.component";
import { GameScreenComponent } from "../game-screen/game-screen.component";
import { GridRenderingSubsystem, LayerRenderingSubsystem, BackgroundRenderingSubsystem, TokenRenderingSubsystem } from "@subsystems";


@Component({
  selector: 'app-game',
  standalone: true,
  imports: [GameBarRightComponent, GameBarToolsComponent, GameBarQuickAccessComponent, GameScreenComponent, GameBarMapSelectComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [WorldObjectApiService, MapApiService, GameService, StateService, ViewService, BackgroundRenderingSubsystem, GridRenderingSubsystem, LayerRenderingSubsystem, TokenRenderingSubsystem]
  // Using providers, combined with providedIn: GameComponent, to create a new copy each time component is loaded, since that services should be local per-game
})
export class GameComponent {

}

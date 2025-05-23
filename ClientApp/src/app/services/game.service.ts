import { Injectable, OnDestroy, inject, Injector, DestroyRef, ElementRef, runInInjectionContext } from "@angular/core";
import { GameComponent } from "@components/game/game/game.component";
import { Observable, defer, from, map, switchMap, tap } from "rxjs";
import { BackgroundColorRenderingSubsystem, LayerRenderingSubsystem, TokenRenderingSubsystem, SusbsystemManager, GridRenderingSubsystem } from "./subsystems";
import { StateService } from "./state.service";
import { ViewService } from "./view.service";
import { GameApplication } from "@models/business";
import { Guid } from "app/helpers/guid.type";
import { settings } from '@pixi/settings';


@Injectable({
  providedIn: GameComponent,
})
export class GameService implements OnDestroy {
  private readonly stateService = inject(StateService);
  private readonly viewService = inject(ViewService);
  private canvas!: HTMLCanvasElement;
  private application!: GameApplication;
  private injectorRef = inject(Injector);
  private canvasDestroyRef!: DestroyRef;
  private readonly backgroundColorRenderingSubsystem = inject(BackgroundColorRenderingSubsystem);
  private readonly gridRenderingSubsystem = inject(GridRenderingSubsystem);
  private readonly layerRenderingSubsystem = inject(LayerRenderingSubsystem);
  private readonly tokenRenderingSubsystem = inject(TokenRenderingSubsystem);

  ngOnDestroy(): void {
    this.application.destroy({}, true);
  }

  initialize(worldId: Guid, canvasRef: ElementRef<HTMLCanvasElement>, canvasDestroyRef: DestroyRef): Observable<any> {
    // Default is 1, which is not aligned to any possible screen at all
    settings.RESOLUTION = window.devicePixelRatio;
    return runInInjectionContext((this.injectorRef), () => defer(() => {
      this.canvas = canvasRef.nativeElement;
      this.canvasDestroyRef = canvasDestroyRef;
      this.application = new GameApplication(this.injectorRef);
      //TODO: Enabled pixi devtools, disable in prod build
      (globalThis as any).__PIXI_APP__ = this.application;
      return from(this.stateService.initializeWorldState(worldId))
        .pipe(
          switchMap(() => this.application.initGameApplication(this.canvas)),
          map(() => new SusbsystemManager(this.application, this.stateService, this.canvasDestroyRef, this.injectorRef)),
          tap(subsystemManager => subsystemManager.registerPerMapSubsystem(this.backgroundColorRenderingSubsystem)),
          tap(subsystemManager => subsystemManager.registerPerMapSubsystem(this.gridRenderingSubsystem)),
          tap(subsystemManager => subsystemManager.registerPerMapSubsystem(this.layerRenderingSubsystem)),
          tap(subsystemManager => subsystemManager.registerPerMapSubsystem(this.tokenRenderingSubsystem)),
          tap(() => this.viewService.initializeViewHandlers(this.application, this.canvas, this.canvasDestroyRef))
        );
    }))
  }
}


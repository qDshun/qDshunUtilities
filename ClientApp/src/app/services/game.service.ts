import { DestroyRef, ElementRef, inject, Injectable, Injector, OnDestroy, runInInjectionContext } from '@angular/core';
import { defer, delayWhen, from, map, Observable, tap } from 'rxjs';
import { StateService } from './state.service';
import { ViewService } from './view.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { GameComponent } from '../components/game/game/game.component';
import { GameApplication } from './game/subsystems/game-application';
import { MapRenderingSubsystem } from './game/subsystems/map-rendering.subsystem';
import { SusbsystemManager } from './game/subsystems/subsystem-manager';
import { LayerRenderingSubsystem } from './game/subsystems/layer-rendering.subsystem';
import { TokenRenderingSubsystem } from './game/subsystems/token-rendering.subsystem';

@Injectable({
  providedIn: GameComponent,
})
export class GameService implements OnDestroy {
  private stateService = inject(StateService);
  private viewService = inject(ViewService);
  private canvas!: HTMLCanvasElement;
  private application!: GameApplication;
  private injectorRef = inject(Injector);
  private canvasDestroyRef!: DestroyRef;
  private mapRenderingSubsystem = inject(MapRenderingSubsystem);
  private layerRenderingSubsystem = inject(LayerRenderingSubsystem);
  private tokenRenderingSubsystem = inject(TokenRenderingSubsystem);

  ngOnDestroy(): void {
    this.application.destroy({}, true);
  }

  initialize(canvasRef: ElementRef<HTMLCanvasElement>, canvasDestroyRef: DestroyRef): Observable<any> {
    return runInInjectionContext((this.injectorRef), () => defer(() => {
      this.canvas = canvasRef.nativeElement;
      this.canvasDestroyRef = canvasDestroyRef;
      this.application = new GameApplication(this.injectorRef);

      //TODO: Enabled pixi devtools, disable in prod build
      (globalThis as any).__PIXI_APP__ = this.application;
      return from(this.application.initGame(this.canvas))
        .pipe(
          map(() => new SusbsystemManager(this.application, this.stateService, this.canvasDestroyRef, this.injectorRef)),
          tap(subsystemManager => subsystemManager.registerPerMapSubsystem(this.mapRenderingSubsystem)),
          tap(subsystemManager => subsystemManager.registerPerMapSubsystem(this.layerRenderingSubsystem)),
          tap(subsystemManager => subsystemManager.registerPerMapSubsystem(this.tokenRenderingSubsystem)),
          tap(() => this.viewService.initializeViewHandlers(this.application, this.canvas, this.canvasDestroyRef)),
        );
    }))
  }
}


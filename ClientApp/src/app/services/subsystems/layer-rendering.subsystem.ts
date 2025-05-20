import { Injectable, inject, EffectRef } from "@angular/core";
import { GameComponent } from "@components/game/game/game.component";
import { StateService } from "app/services/state.service";
import { Observable, of } from "rxjs";
import { IPerMapSubsystem } from "./subsystem";
import { SubsystemRootContainerType, GameApplication, GameMap } from "@models/business";
import { BackgroundRenderingSubsystem } from "./background-color-rendering.subsystem";

@Injectable({
  providedIn: GameComponent
})
export class LayerRenderingSubsystem implements IPerMapSubsystem {
  public static DependencyName = 'LayerRenderingSubsystem';
  private stateService = inject(StateService);
  private appRef!: GameApplication;
  private readonly playerInteractableLayers = [SubsystemRootContainerType.BackgroundLayerContainer, SubsystemRootContainerType.GMLayerContainer, SubsystemRootContainerType.InteractableLayerContainer];

  private perMapEffectRefs: EffectRef[] = [];

  public register(app: GameApplication): void {
    this.appRef = app;
  }

  public isRequired(): boolean {
    return true;
  }

  public getDependencies(): string[] {
    return [BackgroundRenderingSubsystem.DependencyName];
  }

  public onBeforeMapDestroy(): Observable<void> {
    let currentMap = this.stateService.currentMap();
    this.perMapEffectRefs.forEach(mapEffect => mapEffect.destroy());
    this.destroyInteractiveLayers(currentMap);
    return of();
  }

  public onAfterMapInit(): Observable<void> {
    let currentMap = this.stateService.currentMap();
    this.createInteractiveLayers(currentMap);
    this.appRef.render(); //TODO: move the call into end of the pipeline instead calling here
    return of();
  }

  /* API */

  public getInteractableLayers() {
    return this.playerInteractableLayers;
  }

  /* endof API */

  private createInteractiveLayers(map: GameMap){
    this.playerInteractableLayers.forEach(layerContainerName => this.createInteractiveLayer(map, layerContainerName));
  }

  private createInteractiveLayer(map: GameMap, layerContainerName: SubsystemRootContainerType) {
    const interactableLayer = this.appRef.board.createBoardChild(layerContainerName, map.id);
    interactableLayer.setSize({height: map.mapTileConfiguration().mapHeight, width: map.mapTileConfiguration().mapWidth});
    interactableLayer.interactive = true;
  }

  private destroyInteractiveLayers(map: GameMap){
    this.playerInteractableLayers.forEach(layerContainerName => this.appRef.board.getBoardChild(layerContainerName, map.id)?.destroy());
  }
}

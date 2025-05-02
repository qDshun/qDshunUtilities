import { Injectable, inject, EffectRef } from "@angular/core";
import { GameComponent } from "@components/game/game/game.component";
import { StateService, GameMap } from "app/services/state.service";
import { Observable, of } from "rxjs";
import { MapRenderingSubsystem } from "./map-rendering.subsystem";
import { IPerMapSubsystem } from "./subsystem";
import { ContainerType, GameApplication } from "@models/business";

@Injectable({
  providedIn: GameComponent
})
export class LayerRenderingSubsystem implements IPerMapSubsystem {
  public static DependencyName = 'LayerRenderingSubsystem';
  private stateService = inject(StateService);
  private appRef!: GameApplication;
  private readonly playerInteractableLayers = [ContainerType.Background, ContainerType.Hidden, ContainerType.Interactable];

  private perMapEffectRefs: EffectRef[] = [];

  public register(app: GameApplication): void {
    this.appRef = app;
  }

  public isRequired(): boolean {
    return true;
  }

  public getDependencies(): string[] {
    return [MapRenderingSubsystem.DependencyName];
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

  private createInteractiveLayer(map: GameMap, layerContainerName: ContainerType) {
    const interactableLayer = this.appRef.board.createBoardChild(layerContainerName, map.id);
    interactableLayer.setSize({height: map.mapTileConfiguration().mapHeight, width: map.mapTileConfiguration().mapWidth});
    interactableLayer.interactive = true;
  }

  private destroyInteractiveLayers(map: GameMap){
    this.playerInteractableLayers.forEach(layerContainerName => this.appRef.board.getBoardChild(layerContainerName, map.id)?.destroy());
  }
}

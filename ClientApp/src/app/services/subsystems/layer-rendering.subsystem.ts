import { Injectable, inject, EffectRef, computed } from "@angular/core";
import { GameComponent } from "@components/game/game/game.component";
import { StateService } from "app/services/state.service";
import { Observable, of } from "rxjs";
import { IPerMapSubsystem } from "./subsystem";
import { SubsystemRootContainerType, GameApplication, GameMap, Layer } from "@models/business";
import { BackgroundColorRenderingSubsystem } from "./background-color-rendering.subsystem";

export interface LayerSubsystemApi {
   getLayers(): Layer[];
   changeLayerTo(layer: Layer): void;
}

@Injectable({
  providedIn: GameComponent
})
export class LayerRenderingSubsystem implements IPerMapSubsystem, LayerSubsystemApi {
  public static DependencyName = 'LayerRenderingSubsystem';
  private stateService = inject(StateService);
  private appRef!: GameApplication;
  //TODO: Move to state service and be able to query from backend?
  private readonly currentMap = computed(() => this.stateService.currentMap())
  private readonly layers = computed(() => [this.currentMap().backgroundLayer, this.currentMap().gmLayer, this.currentMap().interactableLayer])

  private perMapEffectRefs: EffectRef[] = [];

  public register(app: GameApplication): void {
    this.appRef = app;
  }

  public isRequired(): boolean {
    return true;
  }

  public getDependencies(): string[] {
    return [BackgroundColorRenderingSubsystem.DependencyName];
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

  public getLayers() {
    return this.layers();
  }

  public changeLayerTo(layer: Layer): void {
    throw new Error("Method not implemented.");
  }
  /* endof API */

  private createInteractiveLayers(map: GameMap){
    this.layers().forEach(layer => this.createInteractiveLayer(map, layer.rootContainerType));
  }

  private createInteractiveLayer(map: GameMap, layerContainerName: SubsystemRootContainerType) {
    const interactableLayer = this.appRef.board.createBoardChild(layerContainerName, map.id);
    interactableLayer.setSize({height: map.mapTileConfiguration().mapHeight, width: map.mapTileConfiguration().mapWidth});
    interactableLayer.interactive = true;
  }

  private destroyInteractiveLayers(map: GameMap){
    this.layers().forEach(layer => this.appRef.board.getBoardChild(layer.rootContainerType, map.id)?.destroy());
  }
}

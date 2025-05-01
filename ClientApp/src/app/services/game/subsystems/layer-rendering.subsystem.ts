import { Observable, of } from "rxjs";
import { IPerMapSubsystem } from "./subsystem";
import { EffectRef, inject, Injectable } from "@angular/core";
import { GameMap, StateService } from "../../state.service";
import { GameApplication } from "./game-application";
import { ContainerType } from "../../../graphics/container-type.enum";
import { GameComponent } from "../../../components/game/game/game.component";
import { MapRenderingSubsystem } from "./map-rendering.subsystem";

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

import { Container, Graphics, Size } from "pixi.js";
import { Observable, of } from "rxjs";
import { IPerMapSubsystem } from "./subsystem";
import { EffectRef, inject, Injectable, Injector } from "@angular/core";
import { GameMap, StateService } from "../../state.service";
import { GameApplication } from "./game-application";
import { ContainerType } from "../../../graphics/container-type.enum";
import { IGridConfiguration } from "../../../models/grid-configuration.model";
import { GameComponent } from "../../../components/game/game/game.component";

@Injectable({
  providedIn: GameComponent
})
export class MapRenderingSubsystem implements IPerMapSubsystem {
  public static DependencyName = 'MapRenderingSubsystem';
  private stateService = inject(StateService);
  private appRef!: GameApplication;

  private perMapEffectRefs: EffectRef[] = [];

  public register(app: GameApplication): void {
    this.appRef = app;
  }

  public isRequired(): boolean {
    return true;
  }

  public getDependencies(): string[] {
    return [];
  }

  public onBeforeMapDestroy(): Observable<void> {
    let currentMap = this.stateService.currentMap();
    let mapContainer = this.appRef.board.getBoardChild(ContainerType.Map, currentMap.id)!;
    this.destroyMap(mapContainer);
    this.perMapEffectRefs.forEach(mapEffect => mapEffect.destroy());
    return of();
  }

  public onAfterMapInit(): Observable<void> {
    let currentMap = this.stateService.currentMap();

    let mapContainer = this.createOrEnableMapContainer();

    let mapResizeEffectRef = this.appRef.effectWithRender(() => this.resizeMapContainer(mapContainer, currentMap.mapTileConfiguration()));
    this.perMapEffectRefs.push(mapResizeEffectRef);
    // Container size does not have any meaning, containers always have size as their children
    // But it resizes masks and background, so it will actually change the size of map container as well

    let mapBackgroundColorChangeEffectRef = this.appRef.effectWithRender(() => this.changeBackgroundColor(mapContainer, currentMap.backgroundColor()));
    this.perMapEffectRefs.push(mapBackgroundColorChangeEffectRef);

    let mapTileConfigurationChangeEffectRef = this.appRef.effectWithRender(() => this.changeTilesConfiguration(mapContainer, currentMap.mapTileConfiguration()));
    this.perMapEffectRefs.push(mapTileConfigurationChangeEffectRef);

    return of();
  }

  private createOrEnableMapContainer(): Container {
    var currentMap = this.stateService.currentMap();
    let mapContainer = this.appRef.board.getBoardChild(ContainerType.Map, currentMap.id);
    if (mapContainer) {
      mapContainer.visible = true;
    } else {
      mapContainer = this.createMapContainer(currentMap);
    }
    return mapContainer;
  }


  private createMapContainer(map: GameMap): Container {
    let mapContainer = this.appRef.board.createBoardChild(ContainerType.Map, map.id);
    const mapSize = {height: map.mapTileConfiguration().mapHeight, width: map.mapTileConfiguration().mapWidth};

    const background = new Graphics({ label: MapInternalContainers.Background })
      .rect(0, 0, mapSize.width, mapSize.height)
      .fill(map.backgroundColor());
    mapContainer.addChild(background);


    const mask = new Graphics({ label: MapInternalContainers.Mask })
      .rect(0, 0, mapSize.width, mapSize.height)
      .fill(0xFFFFFF);// The color doesn't matter here
    background.label = MapInternalContainers.Background;
    mapContainer.mask = mask;
    mapContainer.addChild(mask);
    return mapContainer;
  }

  private resizeMapContainer(mapContainer: Container, mapTileConfiguration: IGridConfiguration){
    const size: Size = { height: mapTileConfiguration.mapHeight, width: mapTileConfiguration.mapWidth };
    mapContainer.setSize(size);

    let background = mapContainer.getChildByLabel(MapInternalContainers.Background)!;
    background.setSize(size);

    let mask = mapContainer.getChildByLabel(MapInternalContainers.Mask)!;
    mask.setSize(size);
  }

  private changeBackgroundColor(mapContainer: Container, backgroundColor: string): void {
    let background = mapContainer.getChildByLabel(MapInternalContainers.Background)! as Graphics;
    background.fill(backgroundColor);
  }

  private changeTilesConfiguration(mapContainer: Container, mapTileConfiguration: IGridConfiguration): void {
    this.destroyMapCells(mapContainer);
    this.createMapCells(mapContainer, mapTileConfiguration);
  }

  private destroyMap(mapContainer: Container){
    mapContainer.destroy();
  }

  private destroyMapCells(mapContainer: Container){
    let cells = mapContainer.getChildrenByLabel(MapInternalContainers.Cell);
    cells.forEach(cell => cell.destroy(true));

  }

  private createMapCells(mapContainer: Container, mapTileConfiguration: IGridConfiguration) {
    const tileSize = mapTileConfiguration.getTileSize();
    const fitsScreenWidth = Math.floor(mapContainer.width / tileSize.x);
    const fitsScreenHeight = Math.floor(mapContainer.height / tileSize.y);

    for (let i = 0; i <= fitsScreenWidth; i++) {
      for (let j = 0; j <= fitsScreenHeight; j++) {
        const centerCoords = mapTileConfiguration.getTopLeftCoords(i, j);
        const graphicsClone = mapTileConfiguration.tileGraphics.clone();
        graphicsClone.label = MapInternalContainers.Cell;
        //TODO: Move offset (tileSize.x / 2) to mapTileConfiguration
        graphicsClone.x = centerCoords.x + tileSize.x / 2;
        graphicsClone.y = centerCoords.y + tileSize.y / 2;
        mapContainer.addChild(graphicsClone)
      }
    }
  }
}

enum MapInternalContainers {
  Mask = 'Map-mask',
  Background = 'Map-background',
  Cell = 'Map-cell'
}

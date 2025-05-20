import { Injectable, inject, EffectRef } from "@angular/core";
import { GameComponent } from "@components/game/game/game.component";
import { SubsystemRootContainerType, GameApplication, GameMap, IGridConfiguration } from "@models/business";
import { StateService } from "app/services/state.service";
import { Container, Graphics, Size } from "pixi.js";
import { Observable, of } from "rxjs";
import { IPerMapSubsystem } from "./subsystem";


@Injectable({
  providedIn: GameComponent
})
export class GridRenderingSubsystem implements IPerMapSubsystem {
  public static readonly DependencyName = 'GridRenderingSubsystem';
  private readonly rootContainerType = SubsystemRootContainerType.GridContainer;
  private readonly stateService = inject(StateService);
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
    let rootContainer = this.appRef.board.getBoardChild(this.rootContainerType, currentMap.id)!;
    this.destroy(rootContainer);
    this.perMapEffectRefs.forEach(perMapEffectRef => perMapEffectRef.destroy());
    return of();
  }

  public onAfterMapInit(): Observable<void> {
    let currentMap = this.stateService.currentMap();

    let rootContainer = this.createOrEnableRootContainer();

    let mapResizeEffectRef = this.appRef.effectWithRender(() => this.resizeRootContainer(rootContainer, currentMap.mapTileConfiguration()));
    this.perMapEffectRefs.push(mapResizeEffectRef);

    let mapTileConfigurationChangeEffectRef = this.appRef.effectWithRender(() => this.changeTilesConfiguration(rootContainer, currentMap.mapTileConfiguration()));
    this.perMapEffectRefs.push(mapTileConfigurationChangeEffectRef);

    return of();
  }

  private createOrEnableRootContainer(): Container {
    var currentMap = this.stateService.currentMap();
    let rootContainer = this.appRef.board.getBoardChild(this.rootContainerType, currentMap.id);
    if (rootContainer) {
      rootContainer.visible = true;
    } else {
      rootContainer = this.createRootContainer(currentMap);
    }
    return rootContainer;
  }


  private createRootContainer(map: GameMap): Container {
    let rootContainer = this.appRef.board.createBoardChild(this.rootContainerType, map.id);
    const mapSize = {height: map.mapTileConfiguration().mapHeight, width: map.mapTileConfiguration().mapWidth};

    // Mask is used to clip some tiles that may go ouside the actual parent container
    const mask = new Graphics({ label: GridInternalContainers.Mask })
      .rect(0, 0, mapSize.width, mapSize.height)
      .fill(0xFFFFFF);// The color doesn't matter here
    rootContainer.mask = mask;
    rootContainer.addChild(mask);
    return rootContainer;
  }

  private resizeRootContainer(rootContainer: Container, mapTileConfiguration: IGridConfiguration){
    const size: Size = { height: mapTileConfiguration.mapHeight, width: mapTileConfiguration.mapWidth };
    rootContainer.setSize(size);

    let mask = rootContainer.getChildByLabel(GridInternalContainers.Mask)!;
    mask.setSize(size);
  }

  private changeTilesConfiguration(mapContainer: Container, mapTileConfiguration: IGridConfiguration): void {
    this.destroyMapCells(mapContainer);
    this.createMapCells(mapContainer, mapTileConfiguration);
  }

  private destroy(holdingContainer: Container){
    holdingContainer.destroy();
  }

  private destroyMapCells(mapContainer: Container){
    let cells = mapContainer.getChildrenByLabel(GridInternalContainers.Cell);
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
        graphicsClone.label = GridInternalContainers.Cell;
        //TODO: Move offset (tileSize.x / 2) to mapTileConfiguration
        graphicsClone.x = Math.round(centerCoords.x + tileSize.x / 2);
        graphicsClone.y = Math.round(centerCoords.y + tileSize.y / 2);
        mapContainer.addChild(graphicsClone)
      }
    }
  }
}

enum GridInternalContainers {
  Mask = 'Grid-mask',
  Cell = 'Grid-cell'
}

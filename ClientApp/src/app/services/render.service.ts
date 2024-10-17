import { effect, ElementRef, inject, Injectable, Injector } from '@angular/core';
import { defer, from, map, Observable, tap } from 'rxjs';
import { IMapTileConfiguration } from '../models/map-tile.model';
import { GameMap, StateService } from './state.service';
import { Application, Container, Graphics } from 'pixi.js';
import { DropShadowFilter } from 'pixi-filters';
import { ViewService } from './view.service';
@Injectable({
  providedIn: 'root'
})
export class RenderService {
  private canvas!: HTMLCanvasElement;
  private application!: Application;
  private stateService = inject(StateService);
  private viewService = inject(ViewService);
  private injector = inject(Injector);
  private _renderedMapId: string | null = null;
  constructor() { }

  initialize(canvasRef: ElementRef<HTMLCanvasElement>): Observable<any> {
    return defer(() => {
      this.canvas = canvasRef.nativeElement;
      const canvasWidth = this.canvas.clientWidth;
      const canvasHeight = this.canvas.clientHeight;
      this.application = new Application();
      return from(this.application.init(
        {
          background: '#1099bb',
          canvas: this.canvas,
          width: canvasWidth,
          height: canvasHeight,
          autoStart: false
        }))
        .pipe(
          tap(() => this.application.stage.setSize(canvasWidth, canvasHeight)),
          tap(() => this.viewService.initializeViewHandlers(this.application, this.canvas)),
          map(() => this.createBoardContainer(this.stateService.map)),
          tap((boardContainer) => effect(() => this.onMapChanged(this.stateService.currentMapId(), boardContainer), { injector: this.injector })),
        );
    })
  }

  onMapChanged(mapId: string, boardContainer: Container) {
    const previousMap = this._renderedMapId;
    if (previousMap) {
      this.hideMap(previousMap, boardContainer);
    }
    const currentMap = this.stateService.maps().find(m => m.id == mapId);
    if (!currentMap) {
      alert('Error: Map desync!');
      return;
    }
    this.renderMap(currentMap, boardContainer);
    this.application.renderer.render(this.application.stage)
  }

  hideMap(mapId: string, boardContainer: Container) {
    let mapContainer = this.getMapContainer(mapId, boardContainer);
    if (!mapContainer) {
      alert('Error: Empty hide map called');
      return;
    }
    mapContainer.visible = false;
  }

  renderMap(map: GameMap, boardContainer: Container): void {
    this._renderedMapId = map.id;
    let container = this.getMapContainer(map.id, boardContainer);
    if (container) {
      container.visible = true;
      return;
    }

    container = this.createMapContainer(map, boardContainer);
    this.renderMapCells(container, map.mapTileConfiguration());
  }


  private renderMapCells(container: Container, mapTileConfiguration: IMapTileConfiguration) {
    const tileSize = mapTileConfiguration.getTileSize();
    const fitsScreenWidth = Math.floor(container.width / tileSize.x);
    const fitsScreenHeight = Math.floor(container.height / tileSize.y);

    for (let i = 0; i <= fitsScreenWidth; i++) {
      for (let j = 0; j <= fitsScreenHeight; j++) {
        const centerCoords = mapTileConfiguration.getCenterCoords(i, j);
        const graphicsClone = mapTileConfiguration.mapTileGraphics.clone();
        //TODO: Move offset (tileSize.x / 2) to mapTileConfiguration
        graphicsClone.x = centerCoords.x + tileSize.x / 2;
        graphicsClone.y = centerCoords.y + tileSize.y / 2;
        container.addChild(graphicsClone);
      }

    }
  }

  private createBoardContainer(map: GameMap): Container {
    const boardContainerTag = 'Board-layer';
    const boardContainer = new Container({
      width: map.mapTileConfiguration().mapWidth,
      height: map.mapTileConfiguration().mapHeight,
      visible: true,
      label: boardContainerTag,
    });

    boardContainer.label = boardContainerTag;
    this.application.stage.addChild(boardContainer);
    var dropShadowFilter = new DropShadowFilter({ color: 0x000020, alpha: 2, blur: 6, quality: 4 });
    dropShadowFilter.padding = 80;
    boardContainer.filters = [dropShadowFilter];
    return boardContainer;
  }

  private getMapContainer(mapId: string, boardContainer: Container) {
    const mapLayerTag = 'Map-Layer-';
    const mapLabel = mapLayerTag + mapId;
    const result = boardContainer.getChildByLabel(mapLabel);
    return result;
  }


  private createMapContainer(map: GameMap, parentContainer: Container) {
    const mapLayerTag = 'Map-Layer-';
    const mapLabel = mapLayerTag + map.id;
    const mapContainer = new Container({
      width: map.mapTileConfiguration().mapWidth,
      height: map.mapTileConfiguration().mapHeight,
      visible: true
    });


    mapContainer.label = mapLabel;
    parentContainer.addChild(mapContainer);
    const background = new Graphics().rect(0, 0, map.mapTileConfiguration().mapWidth, map.mapTileConfiguration().mapHeight).fill(map.backgroundColor())
    mapContainer.addChild(background);

    const mask = new Graphics().rect(0, 0, map.mapTileConfiguration().mapWidth, map.mapTileConfiguration().mapHeight)
      .fill(0xFFFFFF);// The color doesn't matter here
    mapContainer.mask = mask;
    mapContainer.addChild(mask)
    return mapContainer;
  }


  private getRandomColor(): string {
    return "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0")
  }
}

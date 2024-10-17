import { effect, ElementRef, inject, Injectable, Injector } from '@angular/core';
import { defer, filter, from, fromEvent, map, merge, Observable, pairwise, switchMap, takeUntil, tap, throttleTime } from 'rxjs';
import { IMapTileConfiguration } from '../models/map-tile.model';
import { GameMap, StateService } from './state.service';
import { Application, Container, Graphics, Point } from 'pixi.js';
import { DropShadowFilter } from 'pixi-filters';
@Injectable({
  providedIn: 'root'
})
export class RenderService {
  private canvas!: HTMLCanvasElement;
  private application!: Application;
  private stateService = inject(StateService);
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
          tap(() => this.initializeResizeHandler()),
          tap(() => this.initializeZoomHandler()),
          tap(() => this.initializePanHandler()),
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

  private resizeTo(width: number, height: number) {
    this.application.renderer.resize(width, height);
    this.application.renderer.render(this.application.stage);
  }


  private zoom(event: WheelEvent) {
    const scaleSpeed = 0.2;
    const container = this.application.stage;
    // Determine the zoom direction (up or down)
    const zoomDirection = event.deltaY > 0 ? -1 : 1;

    // Adjust the scale factor by multiplying or dividing by a zoom factor
    const scaleDifference = zoomDirection * scaleSpeed;
    // Save the old scale and calculate the new scale
    const oldScale = container.scale.x;
    const newScale = Math.max(0.1, Math.min(3, oldScale + scaleDifference));
    const scaleRatio = newScale / oldScale;

    // To zoom relative to the mouse position, adjust the container's position
    container.position.x -= (event.layerX - container.position.x) * (scaleRatio - 1);
    container.position.y -= (event.layerY - container.position.y) * (scaleRatio - 1);

    container.scale.set(newScale);
    this.application.renderer.render(this.application.stage);
  }

  private pan(deltaX: number, deltaY: number) {
    this.application.stage.position.x += deltaX;
    this.application.stage.position.y += deltaY;
    requestAnimationFrame(() => {
      this.application.renderer.render(this.application.stage);
    });
  }

  private initializeZoomHandler() {
    fromEvent<WheelEvent>(this.canvas, 'wheel')
      .pipe(
        tap((e: WheelEvent) => this.zoom(e))
      )
      .subscribe();

  }

  private initializePanHandler() {
    const accumulator = new Point(0, 0);
    const onMouseDown$ = fromEvent<MouseEvent>(this.canvas, 'mousedown');
    const onMouseLeave$ = fromEvent<MouseEvent>(this.canvas, 'mouseleave');
    const onMouseUp$ = fromEvent<MouseEvent>(this.canvas, 'mouseup');
    const onMouseMove$ = fromEvent<MouseEvent>(this.canvas, 'mousemove');
    const onPanStop$ = merge(onMouseUp$, onMouseLeave$);
    onMouseDown$.pipe(
      filter(event => event.button == 2),
      tap(event => event.preventDefault()),
      switchMap((startEvent: MouseEvent) =>
        onMouseMove$.pipe(
          pairwise(),
          tap(([prev, curr]) => {
            accumulator.x += curr.clientX - prev.clientX;
            accumulator.y += curr.clientY - prev.clientY;
          }),
          throttleTime(16), // Throttle to roughly 60fps (16ms)
          tap(() => this.pan(accumulator.x, accumulator.y)),
          tap(() => accumulator.set(0, 0)),
          takeUntil(onPanStop$)
        )
      )
    )
      .subscribe();
  }

  private initializeResizeHandler() {
    fromEvent(window, 'resize')
      .pipe(
        tap(() => this.resizeTo(this.canvas.clientWidth, this.canvas.clientHeight))
      )
      .subscribe();
  }

  private getRandomColor(): string {
    return "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0")
  }
}

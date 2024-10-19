import { DestroyRef, effect, ElementRef, inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import { defer, from, map, Observable, tap } from 'rxjs';
import { IMapTileConfiguration } from '../models/map-tile.model';
import { GameMap, RenderableObject, StateService } from './state.service';
import { Application, Container, Graphics, Sprite, Texture } from 'pixi.js';
import { DropShadowFilter } from 'pixi-filters';
import { ViewService } from './view.service';
import { BoardContainer, ContainerType, getCorrespondingLayer } from '../helpers/container.helper';
import { DraggableService } from './draggable.service';

@Injectable({
  providedIn: 'root'
})
export class RenderService {
  private stateService = inject(StateService);
  private viewService = inject(ViewService);
  private draggableService = inject(DraggableService);
  private canvas!: HTMLCanvasElement;
  private application!: Application;
  private injectorRef!: Injector;
  private canvasDestroyRef!: DestroyRef;
  private boardContainer!: BoardContainer;
  private _renderedMapId: string | null = null;

  private readonly playerInteractableLayers = [ContainerType.Background, ContainerType.Hidden, ContainerType.Interactable];
  private readonly typesToSwapOnMapChange = [ContainerType.Map, ...this.playerInteractableLayers];

  constructor() { }

  initialize(canvasRef: ElementRef<HTMLCanvasElement>, canvasDestroyRef: DestroyRef, injectorRef: Injector): Observable<any> {
    return runInInjectionContext(injectorRef, () => defer(() => {
      this.canvas = canvasRef.nativeElement;
      this.canvasDestroyRef = canvasDestroyRef;
      this.injectorRef = injectorRef
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
          tap(() => this.viewService.initializeViewHandlers(this.application, this.canvas, this.canvasDestroyRef,)),
          map(() => this.initBoardContainer(this.stateService.maps()[0])),
          tap(() => effect(() => this.onMapChanged(this.stateService.currentMapId()), { injector: this.injectorRef })),
          tap(() => effect(() => this.onRerenderableObjectsChange(this.stateService.currentMapId()), { injector: this.injectorRef }))
        );
    }))
  }

  onRerenderableObjectsChange(mapId: string) {
    const currentMap = this.stateService.maps().find(m => m.id == mapId);
    if (!currentMap) {
      alert('Error: Map desync!');
      return;
    }

    this.playerInteractableLayers.forEach(layerContainerName  => {
      // getCorrespondingLayer(currentMap, layerContainerName).tokens().forEach(token => {
      //   this.renderMapSprite(interactableLayer, token, map.mapTileConfiguration())
      // });
      getCorrespondingLayer(currentMap, layerContainerName).renderableObjects().forEach(ro => {
        const layerContainer = this.boardContainer.getBoardChild(layerContainerName, currentMap.id);
        if (!layerContainer) {
          alert('Error: Layer desync!');
          return;
        }

        this.updateOrCreateRenderableObject(layerContainer, ro, currentMap.mapTileConfiguration())
      });
    });
  }

  private updateOrCreateRenderableObject(layerContainer: Container, renderableObject: RenderableObject, mapTileConfiguration: IMapTileConfiguration) {
    const label = 'Renderable-' + renderableObject.id;
    let existingSprite = (layerContainer.getChildByLabel(label) as Sprite);
    if (!existingSprite){
      existingSprite = new Sprite({ texture: Texture.WHITE, width: 20, height: 20, anchor: 0.5, interactive: true, cursor: 'pointer', label});
      this.draggableService.makeDraggable({source: existingSprite, dragContainer: layerContainer, destroyRef: this.canvasDestroyRef, renderableObject, application: this.application, mapTileConfiguration, allowDrag: true})
      // const draggableSprite = new Draggable<Sprite>(existingSprite, layerContainer, this.canvasDestroyRef, true, renderableObject, this.application, mapTileConfiguration);
      layerContainer.addChild(existingSprite);
    }

    this.onSnapUpdated(existingSprite, renderableObject, mapTileConfiguration);
  }

  onSnapUpdated(sprite: Sprite, renderableObject: RenderableObject, mapTileConfiguration: IMapTileConfiguration){
    const snap = renderableObject.snap();
    if (snap) {
      if (snap.type == 'tile') {
        sprite.position = mapTileConfiguration.getCenterCoords(snap.i, snap.j);
      }
      if (snap.type == 'free'){
        sprite.position.x = snap.x;
        sprite.position.y = snap.y;
      }
      this.rerenderWithAnimationFrame();
    }
  }

  onMapChanged(mapId: string) {
    const previousMap = this._renderedMapId;
    if (previousMap) {
      this.setMapVisability(previousMap, false);
    }
    const currentMap = this.stateService.maps().find(m => m.id == mapId);
    if (!currentMap) {
      alert('Error: Map desync!');
      return;
    }
    this.renderMap(currentMap);
    this.application.renderer.render(this.application.stage);
  }

  setMapVisability(mapId: string, visibility: boolean) {
    this.typesToSwapOnMapChange.forEach(type => {
      let container = this.boardContainer.getBoardChild(type, mapId);
      if (!container) {
        alert(`Error: trying set visibility on missing container with type ${type}`);
        return;
      }
      container.visible = visibility;
    });
  }

  renderMap(map: GameMap): void {
    this._renderedMapId = map.id;
    let mapContainer = this.boardContainer.getBoardChild(ContainerType.Map, map.id)
    if (mapContainer) {
      this.setMapVisability(map.id, true);
      return;
    }

    mapContainer = this.boardContainer.createBoardChild(ContainerType.Map, map.id);
    this.initMapContainer(mapContainer, map);
    this.playerInteractableLayers.forEach(layerContainerName => this.createInteractiveLayer(map, layerContainerName));
  }

  private renderMapCells(container: Container, mapTileConfiguration: IMapTileConfiguration) {
    const tileSize = mapTileConfiguration.getTileSize();
    const fitsScreenWidth = Math.floor(container.width / tileSize.x);
    const fitsScreenHeight = Math.floor(container.height / tileSize.y);

    for (let i = 0; i <= fitsScreenWidth; i++) {
      for (let j = 0; j <= fitsScreenHeight; j++) {
        const centerCoords = mapTileConfiguration.getTopLeftCoords(i, j);
        const graphicsClone = mapTileConfiguration.mapTileGraphics.clone();
        //TODO: Move offset (tileSize.x / 2) to mapTileConfiguration
        graphicsClone.x = centerCoords.x + tileSize.x / 2;
        graphicsClone.y = centerCoords.y + tileSize.y / 2;
        container.addChild(graphicsClone);
      }

    }
  }

  private createInteractiveLayer(map: GameMap, layerContainerName: ContainerType) {
    const interactableLayer = this.boardContainer.createBoardChild(layerContainerName, map.id);
    interactableLayer.interactive = true;
  }

  private initBoardContainer(map: GameMap) {
    //TODO: add empty world (no maps) handling
    const boardContainerTag = 'Board-layer';
    const boardContainer = new BoardContainer({
      width: map.mapTileConfiguration().mapWidth,
      height: map.mapTileConfiguration().mapHeight,
      visible: true,
      label: boardContainerTag,
      position: {x: 80, y: 80} //TODO: this of offset, refactor it
    });

    boardContainer.label = boardContainerTag;
    this.application.stage.addChild(boardContainer);
    var dropShadowFilter = new DropShadowFilter({ color: 0x000020, alpha: 2, blur: 6, quality: 4 });
    dropShadowFilter.padding = 80;
    boardContainer.filters = [dropShadowFilter];
    this.boardContainer = boardContainer;
  }

  private initMapContainer(mapContainer: Container, map: GameMap) {
    mapContainer.visible = true;

    const background = new Graphics().rect(0, 0, map.mapTileConfiguration().mapWidth, map.mapTileConfiguration().mapHeight).fill(map.backgroundColor())
    mapContainer.addChild(background);

    const mask = new Graphics().rect(0, 0, map.mapTileConfiguration().mapWidth, map.mapTileConfiguration().mapHeight)
      .fill(0xFFFFFF);// The color doesn't matter here
    mapContainer.mask = mask;
    mapContainer.addChild(mask);

    this.renderMapCells(mapContainer, map.mapTileConfiguration());
  }

  rerenderWithAnimationFrame() {
    requestAnimationFrame(() => {
      this.application.renderer.render(this.application.stage);
    });

  }

  private getRandomColor(): string {
    return "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0")
  }
}


import { Injectable, inject, EffectRef } from "@angular/core";
import { GameComponent } from "@components/game/game/game.component";
import { GameApplication, SubsystemRootContainerType, GameMap, RenderableObject, IGridConfiguration } from "@models/business";
import { Container, Sprite } from "pixi.js";
import { Subject } from "rxjs";
import { DraggableService } from "../draggable.service";
import { StateService } from "../state.service";
import { LayerRenderingSubsystem } from "./layer-rendering.subsystem";
import { IPerMapSubsystem } from "./subsystem";
import { BackgroundColorRenderingSubsystem } from "./background-color-rendering.subsystem";




@Injectable({
  providedIn: GameComponent
})
export class TokenRenderingSubsystem implements IPerMapSubsystem {

  public static DependencyName = 'TokenRenderingSubsystem';
  private stateService = inject(StateService);
  private draggableService = inject(DraggableService);
  private appRef!: GameApplication;

  //TODO: Remove copy-pasta and use APIs from dependencies, after dependencies are properly implemented
  private readonly playerInteractableLayers = [SubsystemRootContainerType.BackgroundLayerContainer, SubsystemRootContainerType.GMLayerContainer, SubsystemRootContainerType.InteractableLayerContainer];
  private perMapEffectRefs: EffectRef[] = [];
  //TODO: Rewrite it somehow, used to notify draggable service
  private mapDestroyed$!: Subject<void>;

  register(app: GameApplication): void {
    this.appRef = app;
  }

  isRequired(): boolean {
    return true;
  }

  getDependencies(): string[] {
    //TODO: Dependencies dont work as of right now, rework them so they would work
    return [BackgroundColorRenderingSubsystem.DependencyName, LayerRenderingSubsystem.DependencyName];
  }

  onAfterMapInit(): void {
    const currentMap = this.stateService.currentMap();
    this.mapDestroyed$ = new Subject<void>();
    let renderableObjectChange = this.appRef.effectWithRender(() => this.onRerenderableObjectsChange(currentMap));
    this.perMapEffectRefs.push(renderableObjectChange);

  }

  onBeforeMapDestroy(): void {
    this.mapDestroyed$.next();
    this.mapDestroyed$.complete();

    const currentMap = this.stateService.currentMap();
    this.perMapEffectRefs.forEach(mapEffect => mapEffect.destroy());
    // this.destroyRenderableObjects(currentMap);
    // Renderable objects are destroyed, since layer service destroys their parent layers
    // TODO: Check if it is true and they are properly destroyed
  }

  destroyRenderableObjects(currentMap: GameMap) {
    this.playerInteractableLayers.forEach(layerContainerName => {
      let layer = this.appRef.board.getBoardChild(layerContainerName, currentMap.id)!;
      layer.children.forEach(child => {
        if (child.label.startsWith('Renderable-')){
          child.destroy();
        };
      })
    });
  }


    private onRerenderableObjectsChange(map: GameMap) {
      //TODO: Rewrite this completely, since it is kinda wrong (doesnt delete renderables for example)
      this.playerInteractableLayers.forEach(layerContainerName => {
        this.getCorrespondingLayer(map, layerContainerName).renderableObjects().forEach(ro => {
          const layerContainer = this.appRef.board.getExistingBoardChild(layerContainerName, map.id);
          this.updateOrCreateRenderableObject(layerContainer, ro, map.mapTileConfiguration())
        });
      });
    }

    private updateOrCreateRenderableObject(layerContainer: Container, renderableObject: RenderableObject, gridConfiguration: IGridConfiguration) {
      const label = 'Renderable-' + renderableObject.id;
      const tokenSize = gridConfiguration.cellSize * 1.5;
      let existingSprite = (layerContainer.getChildByLabel(label) as Sprite);
      if (!existingSprite) {
        existingSprite = new Sprite({ texture: renderableObject.texture, width: tokenSize, height: tokenSize, anchor: 0.5, interactive: true, cursor: 'pointer', label });
        this.draggableService.makeDraggable({ source: existingSprite, dragContainer: layerContainer, destroyRef: this.mapDestroyed$, renderableObject, application: this.appRef, mapTileConfiguration: gridConfiguration, allowDrag: true })
        layerContainer.addChild(existingSprite);
      }

      this.onSnapUpdated(existingSprite, renderableObject, gridConfiguration);
    }

    private onSnapUpdated(sprite: Sprite, renderableObject: RenderableObject, mapTileConfiguration: IGridConfiguration) {
      const snap = renderableObject.snap();
      if (snap) {
        if (snap.type == 'tile') {
          sprite.position = mapTileConfiguration.getCenterCoords(snap.i, snap.j);
        }
        if (snap.type == 'free') {
          sprite.position.x = snap.x;
          sprite.position.y = snap.y;
        }
        this.rerenderWithAnimationFrame();
      }
    }

    rerenderWithAnimationFrame() {
      requestAnimationFrame(() => {
        this.appRef.render();
      });
}

private getCorrespondingLayer(map: GameMap, containerType: SubsystemRootContainerType) {
  switch (containerType) {
    case SubsystemRootContainerType.BackgroundLayerContainer:
      return map.backgroundLayer;
    case SubsystemRootContainerType.GMLayerContainer:
      return map.gmLayer;
    case SubsystemRootContainerType.InteractableLayerContainer:
      return map.interactableLayer;
    default:
      throw new Error(`Container type ${containerType} not allowed`);
  }
}
}

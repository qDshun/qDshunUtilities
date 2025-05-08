import { Injectable, inject, EffectRef } from "@angular/core";
import { GameComponent } from "@components/game/game/game.component";
import { GameApplication, ContainerType, IGridConfiguration } from "@models/business";
import { Container, Sprite, Texture } from "pixi.js";
import { Subject } from "rxjs";
import { LayerRenderingSubsystem } from "./layer-rendering.subsystem";
import { MapRenderingSubsystem } from "./map-rendering.subsystem";
import { IPerMapSubsystem } from "./subsystem";
import { DraggableService, GameMap, RenderableObject, StateService } from "@services";



@Injectable({
  providedIn: GameComponent
})
export class TokenRenderingSubsystem implements IPerMapSubsystem {

  public static DependencyName = 'TokenRenderingSubsystem';
  private stateService = inject(StateService);
  private draggableService = inject(DraggableService);
  private appRef!: GameApplication;

  //TODO: Remove copy-pasta and use APIs from dependencies, after dependencies are properly implemented
  private readonly playerInteractableLayers = [ContainerType.Background, ContainerType.Hidden, ContainerType.Interactable];
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
    return [MapRenderingSubsystem.DependencyName, LayerRenderingSubsystem.DependencyName];
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

    private updateOrCreateRenderableObject(layerContainer: Container, renderableObject: RenderableObject, mapTileConfiguration: IGridConfiguration) {
      const label = 'Renderable-' + renderableObject.id;
      let existingSprite = (layerContainer.getChildByLabel(label) as Sprite);
      if (!existingSprite) {
        existingSprite = new Sprite({ texture: Texture.WHITE, width: 20, height: 20, anchor: 0.5, interactive: true, cursor: 'pointer', label });
        this.draggableService.makeDraggable({ source: existingSprite, dragContainer: layerContainer, destroyRef: this.mapDestroyed$, renderableObject, application: this.appRef, mapTileConfiguration, allowDrag: true })
        layerContainer.addChild(existingSprite);
      }

      this.onSnapUpdated(existingSprite, renderableObject, mapTileConfiguration);
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

private getCorrespondingLayer(map: GameMap, containerType: ContainerType) {
  switch (containerType) {
    case ContainerType.Background:
      return map.backgroundLayer;
    case ContainerType.Hidden:
      return map.hiddenLayer;
    case ContainerType.Interactable:
      return map.interactableLayer;
    default:
      throw new Error(`Container type ${containerType} not allowed`);
  }
}
}

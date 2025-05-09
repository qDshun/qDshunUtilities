import { Injectable } from '@angular/core';
import { Application, Container, FederatedPointerEvent, Sprite, ViewContainer } from 'pixi.js';
import { fromEvent, tap, merge, filter, switchMap, take, takeUntil, throttleTime, Observable } from 'rxjs';
import { HasEventTargetAddRemove } from 'rxjs/internal/observable/fromEvent';
import { IGridConfiguration } from '../models/grid-configuration.model';
import { RenderableObject } from './state.service';

@Injectable({
  providedIn: 'root'
})
export class DraggableService {
  //TODO: move it to subsystem
  public makeDraggable<T extends ViewContainer & HasEventTargetAddRemove<any>>({
    source,
    dragContainer,
    destroyRef,
    allowDrag = true,
    renderableObject,
    application,
    mapTileConfiguration
  }: DraggableFunctionArgs<T>) {
    const initializeDragTracking = () => {
      const keydown$ = fromEvent<KeyboardEvent>(document, 'keydown');
      const keyup$ = fromEvent<KeyboardEvent>(document, 'keyup');
      let isAltPressed = false;
      keydown$.pipe(
        filter(event => event.altKey),
        tap(() => isAltPressed = true)
      ).subscribe();

      keyup$.pipe(
        filter(event => event.key === 'Alt'),
        tap(() => isAltPressed = false)
      ).subscribe();
      source.interactive = true

      let copyToDrag: T;

      const dragStop$ = fromEvent(dragContainer, 'mouseup')
      fromEvent(source, 'mousedown').pipe(
        tap(() => copyToDrag = createCopyToDrag(source)),
        switchMap(() => fromEvent<FederatedPointerEvent>(dragContainer, 'mousemove').pipe(
          takeUntil(dragStop$)
        )),
        throttleTime(1000 / 60), // Throttle to limit FPS to 60
        tap(event => updatePosition(copyToDrag, event)),
        tap(() => requestAnimationFrame(() => application.render())),
        switchMap(() => dragStop$.pipe(
          take(1),
          tap(() => snap(isAltPressed, copyToDrag)),
          tap(() => destroyCopyToDrag(copyToDrag))
        )),
        takeUntil(destroyRef)
      ).subscribe();
    };

    const snap = (isAltPressed: boolean, copy: T) => {
      //TODO: Rewrite so it will be allowed to drag outside, but snap/delete token if mouseup happened outside dragContainer
      if (isAltPressed) {
        renderableObject.snap.set({ type: 'free', x: copy.position.x, y: copy.position.y });
      } else {
        const [i, j] = mapTileConfiguration.getTileCoordinatesByPoint(copy.position.x, copy.position.y);
        renderableObject.snap.set({ type: 'tile', i, j });
      }
    };

    const createCopyToDrag = (sprite: T) => {
      sprite.alpha = 0.5;
      let clonedTexure = new Sprite({
        texture: (source as any as Sprite).texture,
        anchor: (source as any as Sprite).anchor,
        width: source.width,
        height: source.height,
        position: source.position,

      });
      dragContainer.addChild(clonedTexure);
      return clonedTexure as any as T;
    }

    const destroyCopyToDrag = (clonedTexure: T) => {
      dragContainer.removeChild(clonedTexure)
      clonedTexure.destroy();
      source.alpha = 1;
    }

    const updatePosition = (sprite: T, event: FederatedPointerEvent) => {
      sprite.position = event.getLocalPosition(dragContainer);
    }

    if (allowDrag) {
      initializeDragTracking();
    }
  }
}

type DraggableFunctionArgs<T> = {
  source: T;
  dragContainer: Container;
  destroyRef: Observable<void>;
  allowDrag: boolean;
  renderableObject: RenderableObject;
  application: Application;
  mapTileConfiguration: IGridConfiguration;
};

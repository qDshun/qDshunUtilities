import { DestroyRef, Injectable } from '@angular/core';
import { Application, Container, FederatedPointerEvent, ViewContainer } from 'pixi.js';
import { fromEvent, tap, merge, filter, switchMap, take, takeUntil, throttleTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HasEventTargetAddRemove } from 'rxjs/internal/observable/fromEvent';
import { IMapTileConfiguration } from '../models/map-tile.model';
import { RenderableObject } from './state.service';

@Injectable({
  providedIn: 'root'
})
export class DraggableService {

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

      // Set up drag behavior
      const dragStop$ = merge(fromEvent(dragContainer, 'mouseup'), fromEvent(dragContainer, 'mouseleave'));

      fromEvent(source, 'mousedown').pipe(
        switchMap(() => fromEvent<FederatedPointerEvent>(dragContainer, 'mousemove').pipe(
          takeUntil(dragStop$)
        )),
        tap(event => {
          source.position.x += event.movementX;
          source.position.y += event.movementY;
        }),
        throttleTime(1000 / 60), // Throttle to limit FPS to 60
        tap(() => requestAnimationFrame(() => application.render())),
        switchMap(() => dragStop$.pipe(
          take(1),
          tap(() => snap(isAltPressed))
        )),
        takeUntilDestroyed(destroyRef)
      ).subscribe();
    };

    const snap = (isAltPressed: boolean) => {
      if (isAltPressed) {
        renderableObject.snap.set({ type: 'free', x: source.x, y: source.y });
      } else {
        const [i, j] = mapTileConfiguration.getTileCoordinatesByPoint(source.x, source.y);
        renderableObject.snap.set({ type: 'tile', i, j });
      }
    };

    if (allowDrag) {
      initializeDragTracking();
    }
  }
}

type DraggableFunctionArgs<T> = {
  source: T;
  dragContainer: Container;
  destroyRef: DestroyRef;
  allowDrag: boolean;
  renderableObject: RenderableObject;
  application: Application;
  mapTileConfiguration: IMapTileConfiguration;
};

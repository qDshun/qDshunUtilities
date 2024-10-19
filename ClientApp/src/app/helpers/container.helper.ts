import { ContainerChild, Container, Point, Graphics } from "pixi.js";
import { GameMap } from "../services/state.service";
import { fromEvent, HasEventTargetAddRemove } from "rxjs/internal/observable/fromEvent";
import { DestroyRef } from "@angular/core";
import { merge, filter, tap, switchMap, pairwise, throttleTime, takeUntil, map, Observable } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

//TODO: should be movet out of here
export class BoardContainer<T extends ContainerChild = ContainerChild> extends Container<T> {

  getOrCreateBoardChild(this: Container, containerType: ContainerType, id: string) {
    let target = this.getChildByLabel(containerType + id)
    if (target) {
      return target;
    }
    target = new Container({ width: this.width, height: this.height, label: containerType + id });
    this.addChild(target);
    return target;
  }

  getBoardChild(this: Container, containerType: ContainerType, id: string) {
    return this.getChildByLabel(containerType + id);
  }

  createBoardChild(this: Container, containerType: ContainerType, id: string) {
    const parentWidth = this.width;
    const parentHeight = this.height;

    const background = new Graphics({ alpha: 0 }).rect(0, 0, this.width, this.height).fill(0xFFFFFF);
    const child = this.addChild(new Container({
      width: parentWidth,
      height: parentHeight,
      label: containerType + id
    }));

    //Add opaque background to make container full-size instead of child size and be able to track events;
    child.addChild(background);
    return child;
  }
}

export function fromDragEvent(target: HasEventTargetAddRemove<Event>, destroyRef: DestroyRef, buttonToDrag: 2, fps = 60): Observable<Point> {
  const accumulator = new Point(0, 0);
  const onMouseDown$ = fromEvent<PointerEvent>(target, 'mousedown');
  const onMouseLeave$ = fromEvent<MouseEvent>(target, 'mouseleave');
  const onMouseUp$ = fromEvent<MouseEvent>(target, 'mouseup');
  const onMouseMove$ = fromEvent<MouseEvent>(target, 'mousemove');
  const onDragStop$ = merge(onMouseUp$, onMouseLeave$);
  return onMouseDown$.pipe(
    filter(event => event.button == 2),
    tap(event => event.preventDefault()),
    switchMap(() => onMouseMove$.pipe(
      pairwise(),
      tap(([prev, curr]) => {
        accumulator.x += curr.clientX - prev.clientX;
        accumulator.y += curr.clientY - prev.clientY;
      }),
      throttleTime(1000 / fps), // Throttle to roughly 60fps (16ms)
      map(() => accumulator.clone()),
      tap(() => accumulator.set(0, 0)),
      takeUntil(onDragStop$),
      takeUntilDestroyed(destroyRef)
    )
    ),
  );
}

export function IsSameButton(event: MouseEvent, button: 'rmb' | 'lmb') {
  if (button == 'lmb') {
    return (event as any).isPrimary || event.button == 1;
  }
  if (button == 'rmb') {
    return event.button == 2 || ((event instanceof PointerEvent) && event.isPrimary == false);
  }
}

export function getCorrespondingLayer(map: GameMap, containerType: ContainerType) {
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

export enum ContainerType {
  Map = 'Map-layer-',
  Background = 'Background-layer-',
  Hidden = 'Hidden-layer-',
  Interactable = 'Interactable-layer-',
  Token = 'Token-'
}

/*
Stage - main container holding everything togeher, tree root
BoardContainer - Container holding shadows
MapContainer (Map layer) - One per map. Contains clipping mask, tiles, background color. Should contain only things that could not be directly changed by player
Background layer - One per map. Contains background stuff, that could be edited only by GM, but visible to everyone, like background image on sprites.
Hidden layer - One per map. Contains GM-only visible stuff.
Interactive layer - One per map. Contains player-visible stuff.
*/

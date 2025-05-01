import { Injectable, DestroyRef } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { GameComponent } from "@components/game/game/game.component";
import { Application, Point } from "pixi.js";
import { merge, fromEvent, tap, Observable, filter, switchMap, pairwise, throttleTime, map, takeUntil } from "rxjs";
import { HasEventTargetAddRemove } from "rxjs/internal/observable/fromEvent";


@Injectable({
  providedIn: GameComponent
})
export class ViewService {
  //TODO: move to subsystem
  private _application!: Application;
  private _canvas!: HTMLCanvasElement;
  private _destroyRef!: DestroyRef;

  public initializeViewHandlers(application: Application, canvas: HTMLCanvasElement, destroyRef: DestroyRef) {
    this._application = application;
    this._canvas = canvas;
    this._destroyRef = destroyRef;

    merge(
      this.initializeResizeHandler(),
      this.initializeZoomHandler(),
      this.initializePanHandler(),
    )
      .pipe(
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe(event => {
        requestAnimationFrame(() => {
          application.renderer.render(application.stage);
        });
      })
  }

  private initializeResizeHandler() {
    return fromEvent(window, 'resize')
      .pipe(
        tap(() => this.resizeTo(this._application, this._canvas.clientWidth, this._canvas.clientHeight))
      )
  }

  private resizeTo(application: Application, width: number, height: number) {
    application.renderer.resize(width, height);
  }

  private initializeZoomHandler() {
    return fromEvent<WheelEvent>(this._canvas, 'wheel')
      .pipe(
        tap((e: WheelEvent) => this.zoom(this._application, e))
      )
  }


  private zoom(application: Application, event: WheelEvent) {
    const scaleSpeed = 0.2;
    const container = application.stage;
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
  }

  private pan(deltaX: number, deltaY: number) {
    this._application.stage.position.x += deltaX;
    this._application.stage.position.y += deltaY;
  }

  private initializePanHandler() {
    return this.fromDragEvent(this._canvas, this._destroyRef, 2, 60).pipe(
      tap((diff) => this.pan(diff.x, diff.y)),
    );
  }

  private fromDragEvent(target: HasEventTargetAddRemove<Event>, destroyRef: DestroyRef, buttonToDrag: 2, fps = 60): Observable<Point> {
    const accumulator = new Point(0, 0);
    const onMouseDown$ = fromEvent<PointerEvent>(target, 'mousedown');
    const onMouseLeave$ = fromEvent<MouseEvent>(target, 'mouseleave');
    const onMouseUp$ = fromEvent<MouseEvent>(target, 'mouseup');
    const onMouseMove$ = fromEvent<MouseEvent>(target, 'mousemove');
    const onDragStop$ = merge(onMouseUp$, onMouseLeave$);
    return onMouseDown$.pipe(
      filter(event => event.button == buttonToDrag),
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

}

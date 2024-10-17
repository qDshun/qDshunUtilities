import { Injectable } from '@angular/core';
import { Application, Point } from 'pixi.js';
import { fromEvent, tap, merge, filter, switchMap, pairwise, throttleTime, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewService {
  private _application!: Application;
  private _canvas!: HTMLCanvasElement;

  public initializeViewHandlers(application: Application, canvas: HTMLCanvasElement) {
    this._application = application;
    this._canvas = canvas;

    merge(
      this.initializeResizeHandler(),
      this.initializeZoomHandler(),
      this.initializePanHandler(),
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
    application.renderer.render(application.stage);
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
    application.renderer.render(application.stage);
  }

  private pan(deltaX: number, deltaY: number) {
    this._application.stage.position.x += deltaX;
    this._application.stage.position.y += deltaY;


  }

  private initializePanHandler() {
    const accumulator = new Point(0, 0);
    const onMouseDown$ = fromEvent<MouseEvent>(this._canvas, 'mousedown');
    const onMouseLeave$ = fromEvent<MouseEvent>(this._canvas, 'mouseleave');
    const onMouseUp$ = fromEvent<MouseEvent>(this._canvas, 'mouseup');
    const onMouseMove$ = fromEvent<MouseEvent>(this._canvas, 'mousemove');
    const onPanStop$ = merge(onMouseUp$, onMouseLeave$);
    return onMouseDown$.pipe(
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
  }
}

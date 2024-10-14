import { ElementRef, Injectable } from '@angular/core';
import * as PIXI from 'pixi.js';
import { defer, from, Observable, of, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RenderService {
  private canvas!: HTMLCanvasElement;
  private application!: PIXI.Application;
  constructor() { }

  initialize(canvasRef: ElementRef<HTMLCanvasElement>): Observable<void> {
    return defer(() => {
      this.canvas = canvasRef.nativeElement;
      const canvasWidth = this.canvas.clientWidth;
      const canvasHeight = this.canvas.clientHeight;

      this.application = new PIXI.Application();
      return from(this.application.init(
        {
          background: '#1099bb',
          resizeTo: undefined,
          canvas: this.canvas,

        }))
        .pipe(
          tap(() => this.application.renderer.resize(canvasWidth, canvasHeight)),
          tap(() => this._renderMapCells())
        );
    })

  }

  public resizeTo(width: number, height: number) {
    this.application.renderer.resize(width, height);
  }


  public zoom(event: WheelEvent) {
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

    // Apply the new scale to the container
    console.log(newScale)
    container.scale.set(newScale);
  }

  private _renderMapCells() {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    const hexSize = 20;
    const mapOffset = 80;
    const horizontalSpacingPointyTop = Math.sqrt(3) * hexSize;
    const verticalSpacingPointyTop = 3 / 2 * hexSize;
    const fitsScreenWidth = Math.floor((width - 2 * mapOffset) / horizontalSpacingPointyTop);
    const fitsScreenHeight = Math.floor((height - 2 * mapOffset) / verticalSpacingPointyTop);

    let strokeColor = this.getRandomColor();
    for (let j = 0; j < fitsScreenHeight; j++) {
      for (let i = 0; i < fitsScreenWidth; i++) {
        const hexGeometry = new PIXI.Graphics().regularPoly(0, 0, hexSize, 6)
          // .fill(this.getRandomColor())
          .stroke({ color: strokeColor, width: 2 });

        hexGeometry.x = mapOffset + horizontalSpacingPointyTop * i + (j % 2 == 0 ? 0 : -1 * horizontalSpacingPointyTop / 2);
        hexGeometry.y = mapOffset + verticalSpacingPointyTop * j;
        console.log(`Drawing x:${hexGeometry.x}, y:${hexGeometry.y}`)
        this.application.stage.addChild(hexGeometry);
      }

    }

  }


  private getRandomColor(): string {
    return "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0")
  }
}

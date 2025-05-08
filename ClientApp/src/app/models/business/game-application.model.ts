import { Injector, CreateEffectOptions, EffectRef, effect } from "@angular/core";
import { Application, RendererDestroyOptions, DestroyOptions } from "pixi.js";
import { Observable, from, tap } from "rxjs";
import { DropShadowFilter } from "pixi-filters";
import { BoardContainer } from "@models/business";

export class GameApplication extends Application {
  public board!: BoardContainer;

  private readonly NO_MAP_COLOR: string = '#1099bb';
  constructor(private injectionContext: Injector){
    super();
  }

  public override destroy(rendererDestroyOptions?: RendererDestroyOptions, options?: DestroyOptions): void {
    this.board = null!;
    super.destroy(rendererDestroyOptions, options);
  }

  public initGame(canvas: HTMLCanvasElement): Observable<void> {
    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;
    return from(this.init(
      {
        background: this.NO_MAP_COLOR, //TODO: change it based on user's theme later
        canvas: canvas,
        width: canvasWidth,
        height: canvasHeight,
        autoStart: false,
      })).pipe(
        tap(() => this.board = this.createBoardContainer()),
      )
  }

  public effectWithRender<T>(effectFn: () => T, options?: CreateEffectOptions): EffectRef {
    return effect(() => {

      effectFn();

      this.render();
    }, {injector: this.injectionContext, ...options});
  }

  private createBoardContainer(): BoardContainer {
    const boardContainerTag = 'Board-layer';
    const boardContainer = new BoardContainer({
      width: 0,
      height: 0,
      visible: true,
      label: boardContainerTag,
      position: { x: 80, y: 80 } //TODO: this of offset, refactor it
    });

    boardContainer.label = boardContainerTag;
    this.stage.addChild(boardContainer);
    var dropShadowFilter = new DropShadowFilter({ color: 0x000020, alpha: 2, blur: 6, quality: 4 });
    dropShadowFilter.padding = 80;
    boardContainer.filters = [dropShadowFilter];
    return boardContainer;
  }
}

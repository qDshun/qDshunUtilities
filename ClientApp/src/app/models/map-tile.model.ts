import * as PIXI from 'pixi.js';

export interface IMapTileConfiguration {
  cellSize: number;
  mapWidth: number;
  mapHeight: number;
  getCenterCoords: (i: number, j: number) => ({ x: number, y: number });
  mapTileGraphics: PIXI.Graphics;
  getTileSize: () => ({ x: number, y: number });
}

export abstract class BaseMapTileConfiguration implements IMapTileConfiguration{
  constructor(
    public cellSize: number,
    public strokeColor: string,
    public mapWidth: number = 800,
    public mapHeight: number = 600
  ) { }

  abstract getCenterCoords: (i: number, j: number) => ({ x: number, y: number });
  abstract mapTileGraphics: PIXI.Graphics;

  getTileSize = () => {
    const tileWidth = this.getCenterCoords(1, 0).x - this.getCenterCoords(0, 0).x;
    const tileHeight = this.getCenterCoords(0, 1).y - this.getCenterCoords(0, 0).y;
    return ({x: tileWidth, y: tileHeight });
  };
}

export class VerticalHexMapTileConfiguration extends BaseMapTileConfiguration {
  getCenterCoords: (i: number, j: number) => ({ x: number; y: number; }) = (i, j) => {
    const horizontalSpacingPointyTop = Math.sqrt(3) * this.cellSize;
    const verticalSpacingPointyTop = 3 / 2 * this.cellSize;

    const x = horizontalSpacingPointyTop * i + (j % 2 == 0 ? 0 : -1 * horizontalSpacingPointyTop / 2);
    const y = verticalSpacingPointyTop * j;
    return { x, y };
  };

  mapTileGraphics: PIXI.Graphics = new PIXI.Graphics().regularPoly(0, 0, this.cellSize, 6)
    .stroke({ color: this.strokeColor, width: 2 });

}

export class HorizontalHexMapTileConfiguration extends BaseMapTileConfiguration {
  getCenterCoords: (i: number, j: number) => ({ x: number; y: number; }) = (i, j) => {

    const horizontalFlatPointyTop = 3/2 * this.cellSize;
    const verticalFlatPointyTop = Math.sqrt(3) * this.cellSize;

    const x = horizontalFlatPointyTop * i;
    const y = verticalFlatPointyTop * j + ( i % 2 == 0 ? verticalFlatPointyTop / 2 : 0);
    return {x, y}
  };

  mapTileGraphics: PIXI.Graphics = new PIXI.Graphics().regularPoly(0, 0, this.cellSize, 6, Math.PI / 2)
    .stroke({ color: this.strokeColor, width: 2 });

}

export class SquareMapTileConfiguration extends BaseMapTileConfiguration {
  getCenterCoords: (i: number, j: number) => ({ x: number; y: number; }) = (i, j) => {
    const halfSide = Math.sqrt(2) * this.cellSize;

    const x = halfSide * i;
    const y = halfSide * j;
    return {x, y}
  };

  mapTileGraphics: PIXI.Graphics = new PIXI.Graphics().regularPoly(0, 0, this.cellSize, 4, Math.PI/4)
    .stroke({ color: this.strokeColor, width: 2 });

}

import { SnappingOptions } from "@models/business";
import { Guid } from "app/helpers/guid.type";

export class MapDto {
  id!: Guid;
  name!: string;
  cellSize!: number;
  strokeColor!: string;
  width!: number;
  height!: number;
  gridType!: GridType
}

export enum GridType {
  Square = 0,
  VerticalHex = 1,
  HorizaontalHex = 2,
}

export class RenderableObjectDto {
  id!: Guid;
  type!: RenderableObjectType;
  snapping!: SnappingOptions;
}

export enum RenderableObjectType {
  Image = 0,
  Token = 1
}

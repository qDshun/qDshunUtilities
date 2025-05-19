import { SnappingOptions } from "@models/business";
import { Guid } from "app/helpers/guid.type";

export class MapDto {
  id!: Guid;
  name!: string;
  cellSize!: number;
  strokeColor!: string;
  backgroundColor!: string;
  width!: number;
  height!: number;
  gridType!: GridType;
  renderableObjects!: RenderableObjectDto[];
}

export enum GridType {
  Square = 0,
  VerticalHex = 1,
  HorizontalHex = 2,
}

export class RenderableObjectDto {
  id!: Guid;
  type!: RenderableObjectType;
  imageUrl!: string;
  snapping!: SnappingOptions;
  layerType!: LayerType;
}

export enum LayerType {
  Background = 0,
  Hidden = 1,
  Interactable = 2
}

export enum RenderableObjectType {
  Image = 0,
  Token = 1
}

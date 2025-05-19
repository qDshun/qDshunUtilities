import { signal, WritableSignal } from "@angular/core";
import { HorizontalHexGridConfiguration, IGridConfiguration, SquareGridConfiguration, VerticalHexGridConfiguration } from "./grid-configuration.model";
import { RenderableObject } from "./renderable-object.model";
import { Guid } from "app/helpers/guid.type";
import { GridType, LayerType, MapDto } from "../response/map.response.model";

export class GameMap {
    public id: Guid;
    public name: WritableSignal<string>;
    public mapTileConfiguration: WritableSignal<IGridConfiguration>;
    public backgroundColor: WritableSignal<string>;

    public backgroundLayer: Layer;
    public hiddenLayer: Layer;
    public interactableLayer: Layer;

  constructor(mapDto: MapDto) {
    this.id = mapDto.id;
    this.name = signal(mapDto.name);
    this.mapTileConfiguration = signal(this.createMapTileConfiguration(mapDto));
    this.backgroundColor = signal(mapDto.backgroundColor);

    const backgroundgObjects = mapDto.renderableObjects.filter(roDto => roDto.layerType == LayerType.Background)
      .map(roDto => new RenderableObject(roDto.id, roDto.imageUrl, roDto.type, roDto.snapping));

    const hiddenObjects = mapDto.renderableObjects.filter(roDto => roDto.layerType == LayerType.Hidden)
      .map(roDto => new RenderableObject(roDto.id, roDto.imageUrl, roDto.type, roDto.snapping));

    const interactableObjects = mapDto.renderableObjects.filter(roDto => roDto.layerType == LayerType.Interactable)
      .map(roDto => new RenderableObject(roDto.id, roDto.imageUrl, roDto.type, roDto.snapping));


    this.backgroundLayer = new Layer(signal(backgroundgObjects));
    this.hiddenLayer = new Layer(signal(hiddenObjects));
    this.interactableLayer = new Layer(signal(interactableObjects));
  }

  private createMapTileConfiguration(mapDto: MapDto): IGridConfiguration {
    switch (mapDto.gridType) {
      case GridType.Square:
        return new SquareGridConfiguration(mapDto.cellSize, mapDto.strokeColor, mapDto.width, mapDto.height);
      case GridType.VerticalHex:
        return new VerticalHexGridConfiguration(mapDto.cellSize, mapDto.strokeColor, mapDto.width, mapDto.height);
      case GridType.HorizontalHex:
        return new HorizontalHexGridConfiguration(mapDto.cellSize, mapDto.strokeColor, mapDto.width, mapDto.height);
      default:
        throw new Error(`Unsupported GridType: ${mapDto.gridType}`);
    }
  }
}

export class Layer {
  constructor(
    public renderableObjects: WritableSignal<RenderableObject[]>,
  ) { }
}


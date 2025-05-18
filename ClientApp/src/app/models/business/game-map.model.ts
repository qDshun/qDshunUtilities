import { WritableSignal } from "@angular/core";
import { IGridConfiguration } from "./grid-configuration.model";
import { Token, RenderableObject } from "./renderable-object.model";

export class GameMap {
  constructor(
    public id: string,
    public name: WritableSignal<string>,
    public mapTileConfiguration: WritableSignal<IGridConfiguration>,
    public backgroundColor: WritableSignal<string>,

    public backgroundLayer: Layer,
    public hiddenLayer: Layer,
    public interactableLayer: Layer,
  ) { }
}

export class Layer {
  constructor(
    public tokens: WritableSignal<Token[]>,
    public renderableObjects: WritableSignal<RenderableObject[]>,
  ) { }
}


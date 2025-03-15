import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { VerticalHexMapTileConfiguration, HorizontalHexMapTileConfiguration, SquareMapTileConfiguration, IMapTileConfiguration } from '../models/map-tile.model';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor() { }

  public maps = this.getMaps();
  public map = this.getCurrentMap();
  public currentMapId = signal('1');

  private getMaps(): Signal<GameMap[]> {
    return signal([
      new GameMap('1', signal('Forest'), signal(new VerticalHexMapTileConfiguration(20, this.getRandomColor())), signal(this.getRandomColor()), new Layer(signal([]), signal([])), new Layer(signal([]), signal([])), new Layer(signal([]), signal([]))),
      new GameMap('2', signal('Village'), signal(new HorizontalHexMapTileConfiguration(20, this.getRandomColor(), 1200, 800)), signal(this.getRandomColor()), new Layer(signal([]), signal([])), new Layer(signal([]), signal([])), new Layer(signal([]), signal([]))),
      new GameMap('3', signal('Volcano'), signal(new SquareMapTileConfiguration(20, this.getRandomColor(), 900, 200)), signal(this.getRandomColor()), new Layer(signal([]), signal([])), new Layer(signal([]), signal([])), new Layer(signal([]), signal([]))),
    ]);
  }

  private getCurrentMap(): GameMap {
    return new GameMap(
      '1',
      signal('Forest'),
      signal(new VerticalHexMapTileConfiguration(20, this.getRandomColor())),
      signal(this.getRandomColor()),
      new Layer(signal([]), signal([])),
      new Layer(signal([]), signal([])),
      new Layer(signal([]), signal([])),
    );
  }

  private updateCurrentMapId(mapId: string){
    this.currentMapId.set(mapId);
  }

  private getRandomColor(): string {
    return "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0")
  }
}

export class GameMap {
  constructor(
    public id: string,
    public name: WritableSignal<string>,
    public mapTileConfiguration: WritableSignal<IMapTileConfiguration>,
    public backgroundColor: WritableSignal<string>,

    public mapLayer: Layer,
    public hiddenLayer: Layer,
    public interactableLayer: Layer,
  ) { }
}

export class Layer {
  constructor(
    public tokens: WritableSignal<WritableSignal<Token>[]>,
    public renderableObjects: WritableSignal<WritableSignal<RenderableObject>[]>,
  ) { }
}

export class RenderableObject {

}

export class Token extends RenderableObject {

}

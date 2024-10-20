import { computed, Injectable, OnDestroy, signal, WritableSignal } from '@angular/core';
import { VerticalHexMapTileConfiguration, HorizontalHexMapTileConfiguration, SquareMapTileConfiguration, IMapTileConfiguration } from '../models/map-tile.model';
import { GameComponent } from '../components/game/game/game.component';

@Injectable({
  providedIn: GameComponent
})
export class StateService implements OnDestroy {
  constructor() { }

  ngOnDestroy(): void {

  }

  public maps = this.getMaps();
  public currentMap = this.getCurrentMapAndThrowIfNotExists();
  public currentMapId = signal('1');
  private tokenMockCounter = 0;

  private getMaps(): WritableSignal<GameMap[]> {
    const values = signal([
      new GameMap('1', signal('Forest'), signal(new VerticalHexMapTileConfiguration(20, this.getRandomColor())), signal(this.getRandomColor()), new Layer(signal([]), signal([])), new Layer(signal([]), signal([])), new Layer(signal([]), signal([new Token('0', `Token ${(this.tokenMockCounter++).toString()}`, 'https://media.istockphoto.com/id/1973365581/vector/sample-ink-rubber-stamp.jpg?s=612x612&w=0&k=20&c=_m6hNbFtLdulg3LK5LRjJiH6boCb_gcxPvRLytIz0Ws=', { type: 'tile', i: 10, j: 10 })]))),
      new GameMap('2', signal('Village'), signal(new HorizontalHexMapTileConfiguration(20, this.getRandomColor(), 1200, 800)), signal(this.getRandomColor()), new Layer(signal([]), signal([])), new Layer(signal([]), signal([])), new Layer(signal([]), signal([new Token('0', `Token ${(this.tokenMockCounter++).toString()}`, 'https://media.istockphoto.com/id/1973365581/vector/sample-ink-rubber-stamp.jpg?s=612x612&w=0&k=20&c=_m6hNbFtLdulg3LK5LRjJiH6boCb_gcxPvRLytIz0Ws=', { type: 'tile', i: 8, j: 8 }), new Token('1', `Token ${(this.tokenMockCounter++).toString()}`, 'https://media.istockphoto.com/id/1973365581/vector/sample-ink-rubber-stamp.jpg?s=612x612&w=0&k=20&c=_m6hNbFtLdulg3LK5LRjJiH6boCb_gcxPvRLytIz0Ws=', { type: 'tile', i: 10, j: 10 })]))),
      new GameMap('3', signal('Volcano'), signal(new SquareMapTileConfiguration(20, this.getRandomColor(), 900, 200)), signal(this.getRandomColor()), new Layer(signal([]), signal([])), new Layer(signal([]), signal([])), new Layer(signal([]), signal([new Token('0', `Token ${(this.tokenMockCounter++).toString()}`, 'https://media.istockphoto.com/id/1973365581/vector/sample-ink-rubber-stamp.jpg?s=612x612&w=0&k=20&c=_m6hNbFtLdulg3LK5LRjJiH6boCb_gcxPvRLytIz0Ws=', { type: 'tile', i: 7, j: 7 }), new Token('1', `Token ${(this.tokenMockCounter++).toString()}`, 'https://media.istockphoto.com/id/1973365581/vector/sample-ink-rubber-stamp.jpg?s=612x612&w=0&k=20&c=_m6hNbFtLdulg3LK5LRjJiH6boCb_gcxPvRLytIz0Ws=', { type: 'tile', i: 9, j: 9 }), new Token('2', `Token ${(this.tokenMockCounter++).toString()}`, 'https://media.istockphoto.com/id/1973365581/vector/sample-ink-rubber-stamp.jpg?s=612x612&w=0&k=20&c=_m6hNbFtLdulg3LK5LRjJiH6boCb_gcxPvRLytIz0Ws=', { type: 'tile', i: 10, j: 10 })]))),
    ]);
    return values;
  }


  private getRandomColor(): string {
    return "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0")
  }

  private getCurrentMapAndThrowIfNotExists() {
    return computed(() => {
      const map = this.maps().find(m => m.id == this.currentMapId());
      if (!map) {
        throw new UnrecoverableError(`Map with id ${this.currentMapId()} not found.`);
      }
      return map;
    });
  }
}

export class UnrecoverableError extends Error {

}

export class GameMap {
  constructor(
    public id: string,
    public name: WritableSignal<string>,
    public mapTileConfiguration: WritableSignal<IMapTileConfiguration>,
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

export class RenderableObject {
  public snap = signal(this._snap);
  constructor(
    public id: string,
    public name: string,
    public url: string,
    private _snap: SnappingOptions
  ) { }
}

export type SnappingOptions =
  | { type: 'tile'; i: number; j: number }
  | { type: 'free'; x: number; y: number };

export class Token extends RenderableObject {

}

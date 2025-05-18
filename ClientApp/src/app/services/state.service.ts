import { Injectable, signal, WritableSignal, computed, inject } from "@angular/core";
import { GameComponent } from "@components/game/game/game.component";
import { VerticalHexGridConfiguration, HorizontalHexGridConfiguration, SquareGridConfiguration, Token, GameMap, AnyWorldObject, WorldObjectType, WorldObjectCharacter, WorldObjectFolder, WorldObjectHandout, Layer } from "@models/business";
import { Observable, ReplaySubject, Subject, tap } from "rxjs";
import { WorldObjectApiService } from "./world-object.api.service";
import { WorldObjectResponse } from "@models/response";
import { FavouritesService } from "./favourites.service";


@Injectable({
  providedIn: GameComponent
})
export class StateService {
  private worldObjectApiService = inject(WorldObjectApiService);
  private favouritesService = inject(FavouritesService);
  public worldObjects: WritableSignal<AnyWorldObject[]> = signal([]);

  private _currentMapId: string | null = null;
  public currentMapId = signal('1');


  public maps: WritableSignal<GameMap[]> = signal([]);
  public currentMap = this.getCurrentMapAndThrowIfNotExists();
  private tokenMockCounter = 0;

  private _onBeforeMapDestroyed$ = new Subject<string>();
  public onBeforeMapDestroyed$ = this._onBeforeMapDestroyed$.asObservable();
  private _onAfterMapInit$ = new Subject<string>();
  public onAfterMapInit$ = this._onAfterMapInit$.asObservable();
  private readonly _ready$ = new ReplaySubject<void>();
  public readonly ready$ = this._ready$.asObservable()

  public changeMap(mapId: string){
    if (this._currentMapId){
      this._onBeforeMapDestroyed$.next(this._currentMapId);
    }
    this.currentMapId.set(mapId);
    this._onAfterMapInit$.next(mapId);
    this._currentMapId = mapId;
  }

  public initializeWorldState(worldId: string): Observable<any> {
    this.maps.set(this.getMaps()())

    const favouriteIds = this.favouritesService.getFavourites();

    return this.worldObjectApiService.getWorldObjects(worldId).pipe(
      tap(response => this.worldObjects.set(response.worldObjects.map(worldObjectDto => this.toWorldObjectModel(worldObjectDto, favouriteIds)))),
      tap(() => this._ready$.next())
    );
  }

  private toWorldObjectModel(worldObjectDto: WorldObjectResponse, favouriteIds: string[]): AnyWorldObject {
    const isFavourite = favouriteIds.includes(worldObjectDto.id);
    switch (worldObjectDto.type) {
      case WorldObjectType.CharacterSheet: {
        return new WorldObjectCharacter(worldObjectDto, isFavourite);
      }
      case WorldObjectType.Folder: {
        return new WorldObjectFolder(worldObjectDto);
      }
      case WorldObjectType.Handout: {
        return new WorldObjectHandout(worldObjectDto, isFavourite);
      }
    }
  }

  private getMaps(): WritableSignal<GameMap[]> {
    const values = signal([
      new GameMap('1', signal('Forest'), signal(new VerticalHexGridConfiguration(20, this.getRandomColor())), signal(this.getRandomColor()), new Layer(signal([]), signal([])), new Layer(signal([]), signal([])), new Layer(signal([]), signal([new Token('0', `Token ${(this.tokenMockCounter++).toString()}`, 'https://media.istockphoto.com/id/1973365581/vector/sample-ink-rubber-stamp.jpg?s=612x612&w=0&k=20&c=_m6hNbFtLdulg3LK5LRjJiH6boCb_gcxPvRLytIz0Ws=', { type: 'tile', i: 10, j: 10 })]))),
      new GameMap('2', signal('Village'), signal(new HorizontalHexGridConfiguration(20, this.getRandomColor(), 1200, 800)), signal(this.getRandomColor()), new Layer(signal([]), signal([])), new Layer(signal([]), signal([])), new Layer(signal([]), signal([new Token('0', `Token ${(this.tokenMockCounter++).toString()}`, 'https://media.istockphoto.com/id/1973365581/vector/sample-ink-rubber-stamp.jpg?s=612x612&w=0&k=20&c=_m6hNbFtLdulg3LK5LRjJiH6boCb_gcxPvRLytIz0Ws=', { type: 'tile', i: 8, j: 8 }), new Token('1', `Token ${(this.tokenMockCounter++).toString()}`, 'https://media.istockphoto.com/id/1973365581/vector/sample-ink-rubber-stamp.jpg?s=612x612&w=0&k=20&c=_m6hNbFtLdulg3LK5LRjJiH6boCb_gcxPvRLytIz0Ws=', { type: 'tile', i: 10, j: 10 })]))),
      new GameMap('3', signal('Volcano'), signal(new SquareGridConfiguration(20, this.getRandomColor(), 900, 200)), signal(this.getRandomColor()), new Layer(signal([]), signal([])), new Layer(signal([]), signal([])), new Layer(signal([]), signal([new Token('0', `Token ${(this.tokenMockCounter++).toString()}`, 'https://media.istockphoto.com/id/1973365581/vector/sample-ink-rubber-stamp.jpg?s=612x612&w=0&k=20&c=_m6hNbFtLdulg3LK5LRjJiH6boCb_gcxPvRLytIz0Ws=', { type: 'tile', i: 7, j: 7 }), new Token('1', `Token ${(this.tokenMockCounter++).toString()}`, 'https://media.istockphoto.com/id/1973365581/vector/sample-ink-rubber-stamp.jpg?s=612x612&w=0&k=20&c=_m6hNbFtLdulg3LK5LRjJiH6boCb_gcxPvRLytIz0Ws=', { type: 'tile', i: 9, j: 9 }), new Token('2', `Token ${(this.tokenMockCounter++).toString()}`, 'https://media.istockphoto.com/id/1973365581/vector/sample-ink-rubber-stamp.jpg?s=612x612&w=0&k=20&c=_m6hNbFtLdulg3LK5LRjJiH6boCb_gcxPvRLytIz0Ws=', { type: 'tile', i: 10, j: 10 })]))),
    ]);
    return values;
  }


  public getRandomColor(): string {
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


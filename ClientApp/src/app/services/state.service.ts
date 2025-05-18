import { Injectable, signal, WritableSignal, computed, inject } from "@angular/core";
import { GameComponent } from "@components/game/game/game.component";
import { VerticalHexGridConfiguration, HorizontalHexGridConfiguration, SquareGridConfiguration, Token, GameMap, AnyWorldObject, WorldObjectType, WorldObjectCharacter, WorldObjectFolder, WorldObjectHandout, Layer } from "@models/business";
import { forkJoin, map, Observable, ReplaySubject, Subject, switchMap, tap } from "rxjs";
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
    const maps = this.getMaps()()
    this.maps.set(maps)

    const favouriteIds = this.favouritesService.getFavourites();

    return this.worldObjectApiService.getWorldObjects(worldId).pipe(
      tap(response => this.worldObjects.set(response.worldObjects.map(worldObjectDto => this.toWorldObjectModel(worldObjectDto, favouriteIds)))),
      switchMap(() => this.initRenderableObjectsTexture(maps)),
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

  //TODO: Rewrite completely when Map Api would be availible
  private initRenderableObjectsTexture(maps: GameMap[]): Observable<void> {
    const renderableObjects = [
      ...maps.flatMap(m => m.hiddenLayer.renderableObjects()),
      ...maps.flatMap(m => m.backgroundLayer.renderableObjects()),
      ...maps.flatMap(m => m.interactableLayer.renderableObjects())
    ];
    return forkJoin(renderableObjects.map(ro => ro.loadTexture())).pipe(
      map(_ => void 0)
    );
  }

  private getMaps(): WritableSignal<GameMap[]> {
    const values = signal([
      new GameMap('1', signal('Forest'), signal(new VerticalHexGridConfiguration(20, this.getRandomColor())), signal(this.getRandomColor()),
        new Layer(signal([]), signal([])), new Layer(signal([]), signal([])), new Layer(signal([]),
          signal([new Token('0', `Token ${(this.tokenMockCounter++).toString()}`, 'https://files.d20.io/images/367846040/hJolqMhEY78rNstomGaDPg/med.png?1700094567', { type: 'tile', i: 10, j: 10 })]))),
      new GameMap('2', signal('Village'), signal(new HorizontalHexGridConfiguration(20, this.getRandomColor(), 1200, 800)), signal(this.getRandomColor()),
        new Layer(signal([]), signal([])), new Layer(signal([]), signal([])), new Layer(signal([]),
          signal([new Token('0', `Token ${(this.tokenMockCounter++).toString()}`, 'https://files.d20.io/images/367846040/hJolqMhEY78rNstomGaDPg/med.png?1700094567', { type: 'tile', i: 8, j: 8 }), new Token('1', `Token ${(this.tokenMockCounter++).toString()}`, 'https://files.d20.io/images/367846040/hJolqMhEY78rNstomG', { type: 'tile', i: 10, j: 10 })]))),
      new GameMap('3', signal('Volcano'), signal(new SquareGridConfiguration(20, this.getRandomColor(), 900, 200)), signal(this.getRandomColor()),
        new Layer(signal([]), signal([])), new Layer(signal([]), signal([])), new Layer(signal([]),
          signal([new Token('0', `Token ${(this.tokenMockCounter++).toString()}`, 'https://files.d20.io/images/367846040/hJolqMhEY78rNstomGaDPg/med.png?1700094567', { type: 'tile', i: 10, j: 10 })]))),
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


import { Injectable, signal, WritableSignal, computed, inject } from "@angular/core";
import { GameComponent } from "@components/game/game/game.component";
import { GameMap, AnyWorldObject, WorldObjectType, WorldObjectCharacter, WorldObjectFolder, WorldObjectHandout } from "@models/business";
import { forkJoin, map, Observable, of, ReplaySubject, Subject, switchMap, tap } from "rxjs";
import { WorldObjectApiService } from "./world-object.api.service";
import { WorldObjectResponse } from "@models/response";
import { FavouritesService } from "./favourites.service";
import { Guid } from "app/helpers/guid.type";
import { MapApiService } from "./map.api.service";


@Injectable({
  providedIn: GameComponent
})
export class StateService {
  private readonly worldObjectApiService = inject(WorldObjectApiService);
  private readonly mapApiService = inject(MapApiService);
  private readonly favouritesService = inject(FavouritesService);
  public worldObjects: WritableSignal<AnyWorldObject[]> = signal([]);

  private _currentMapId: Guid | null = null;
  public currentMapId = signal('1');


  public maps: WritableSignal<GameMap[]> = signal([]);
  public currentMap = this.getCurrentMapAndThrowIfNotExists();

  private _onBeforeMapDestroyed$ = new Subject<string>();
  public onBeforeMapDestroyed$ = this._onBeforeMapDestroyed$.asObservable();
  private _onAfterMapInit$ = new Subject<string>();
  public onAfterMapInit$ = this._onAfterMapInit$.asObservable();
  private readonly _ready$ = new ReplaySubject<void>();
  public readonly ready$ = this._ready$.asObservable()

  public changeMap(mapId: Guid){
    if (this._currentMapId){
      this._onBeforeMapDestroyed$.next(this._currentMapId);
    }
    this.currentMapId.set(mapId);
    this._onAfterMapInit$.next(mapId);
    this._currentMapId = mapId;
  }

  public initializeWorldState(worldId: Guid): Observable<void> {
    return of(void 0).pipe(
      switchMap(() => this.initMaps(worldId)),
      switchMap(() => this.initWorldObjects(worldId)),
      tap(() => console.debug('State service is ready!')),
      tap(() => this._ready$.next())
    )
  }

  private initWorldObjects(worldId: Guid): Observable<void> {
    const favouriteIds = this.favouritesService.getFavourites();

    return this.worldObjectApiService.getWorldObjects(worldId).pipe(
      tap(response => this.worldObjects.set(response.worldObjects.map(worldObjectDto => this.toWorldObjectModel(worldObjectDto, favouriteIds)))),
      map(_ => void 0)
    )
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

  private initMaps(worldId: Guid): Observable<void> {
    return this.mapApiService.getMaps(worldId).pipe(
      map(mapDtos => mapDtos.map(mapDto => new GameMap(mapDto))),
      tap(maps => this.maps = signal(maps)),
      switchMap(maps => this.initRenderableObjectsTexture(maps)),
      tap(() => console.debug('Init of maps done')),
    )
  }

  //TODO: Rewrite completely when Map Api would be availible
  private initRenderableObjectsTexture(maps: GameMap[]): Observable<void> {
    const renderableObjects = [
      ...maps.flatMap(m => m.hiddenLayer.renderableObjects()),
      ...maps.flatMap(m => m.backgroundLayer.renderableObjects()),
      ...maps.flatMap(m => m.interactableLayer.renderableObjects())
    ];
    return forkJoin(renderableObjects.map(ro => ro.loadTexture())).pipe(
      tap(() => console.debug('Init of renderable objects (loading textures) done')),
      map(_ => void 0)
    );
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


import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, map, Observable, of, ReplaySubject, share, switchMap } from 'rxjs';
import { ApiService } from './api.service';
import { WorldObjectResponse } from '../models/world-object-response';

@Injectable({
  providedIn: 'root'
})
export class WorldObjectService {
  private apiService = inject(ApiService);
  private readonly favouriteKey = 'FavouriteWorldObjects';
  private _worldObjectsUpdated$ = new BehaviorSubject<null>(null);
  private _favouriteUpdated$ =  new BehaviorSubject<string[]>(this.getFavourites());
  //TODO: find other ways of doing this

  public worldsOrbjects$ = this._worldObjectsUpdated$.pipe(
    switchMap(() => this.getWorldObjects()),
    share({ connector: () => new ReplaySubject(1) })
  );

  public favouriteUpdated$ = this._favouriteUpdated$.asObservable();

  public favouriteWorldObjects$ = this._favouriteUpdated$.pipe(
    switchMap(() => this.worldsOrbjects$.pipe(
      map(worldObjects => worldObjects.filter(wo => this.getFavourites().includes(wo.id)))
    )),
    share({ connector: () => new ReplaySubject(1) })
  );

  private getWorldObjects(): Observable<WorldObjectResponse[]> {
    return of([
      { path: '/characters/Character 1', id: '1', url: 'https://media.istockphoto.com/id/1973365581/vector/sample-ink-rubber-stamp.jpg?s=612x612&w=0&k=20&c=_m6hNbFtLdulg3LK5LRjJiH6boCb_gcxPvRLytIz0Ws=' },
      { path: '/characters/Character 2', id: '2', url: 'https://media.istockphoto.com/id/1973365581/vector/sample-ink-rubber-stamp.jpg?s=612x612&w=0&k=20&c=_m6hNbFtLdulg3LK5LRjJiH6boCb_gcxPvRLytIz0Ws=' },
      { path: '/characters/Character 3', id: '3', url: 'https://media.istockphoto.com/id/1973365581/vector/sample-ink-rubber-stamp.jpg?s=612x612&w=0&k=20&c=_m6hNbFtLdulg3LK5LRjJiH6boCb_gcxPvRLytIz0Ws=' },
      { path: '/handouts/Handout 1', id: '4', url: 'https://media.istockphoto.com/id/1973365581/vector/sample-ink-rubber-stamp.jpg?s=612x612&w=0&k=20&c=_m6hNbFtLdulg3LK5LRjJiH6boCb_gcxPvRLytIz0Ws=' },
      { path: '/handouts/Handout 1', id: '5', url: 'https://media.istockphoto.com/id/1973365581/vector/sample-ink-rubber-stamp.jpg?s=612x612&w=0&k=20&c=_m6hNbFtLdulg3LK5LRjJiH6boCb_gcxPvRLytIz0Ws=' },
      { path: 'withoutBackslash/Character 7', id: '6', url: 'https://media.istockphoto.com/id/1973365581/vector/sample-ink-rubber-stamp.jpg?s=612x612&w=0&k=20&c=_m6hNbFtLdulg3LK5LRjJiH6boCb_gcxPvRLytIz0Ws=' },
      { path: '/asd/bsd/cds 1', id: '7', url: 'https://media.istockphoto.com/id/1973365581/vector/sample-ink-rubber-stamp.jpg?s=612x612&w=0&k=20&c=_m6hNbFtLdulg3LK5LRjJiH6boCb_gcxPvRLytIz0Ws=' },
      { path: '/asd/bsd/cds 2', id: '8', url: 'https://media.istockphoto.com/id/1973365581/vector/sample-ink-rubber-stamp.jpg?s=612x612&w=0&k=20&c=_m6hNbFtLdulg3LK5LRjJiH6boCb_gcxPvRLytIz0Ws=' },
      { path: '/asd/bss/cds 1', id: '9', url: 'https://media.istockphoto.com/id/1973365581/vector/sample-ink-rubber-stamp.jpg?s=612x612&w=0&k=20&c=_m6hNbFtLdulg3LK5LRjJiH6boCb_gcxPvRLytIz0Ws=' },
    ]);
  }

  toggleFavourite(id: string){
    const favourites = this.getFavourites();
    if (favourites.includes(id)){
      const index = favourites.indexOf(id);
      favourites.splice(index, 1);
    } else {
      favourites.push(id);
    }
    localStorage.setItem(this.favouriteKey, JSON.stringify(favourites));
    this._favouriteUpdated$.next(favourites);
  }

  getFavourites(): string[]{
    const localStorageEntry = localStorage.getItem(this.favouriteKey);
    if (!localStorageEntry){
      return [];
    }
    return JSON.parse(localStorageEntry);
  }
}

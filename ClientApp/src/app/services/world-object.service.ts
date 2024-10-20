import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { WorldObjectResponse } from '../models/response/world-object-response';
import { WorldObject } from '../models/world-object.model';

@Injectable({
  providedIn: 'root'
})
export class WorldObjectService {
  private apiService = inject(ApiService);
  private readonly favouriteKey = 'FavouriteWorldObjects';
  public worldObjects: WritableSignal<WorldObject[]> = signal([]);

  constructor(){
    this.getWorldObjects().subscribe(worldObjectDtos => this.worldObjects.set(worldObjectDtos.map(wod => new WorldObject(wod, this.getFavourites()))));
  }

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
    //TODO: use it when updating signal
    const favourites = this.getFavourites();
    if (favourites.includes(id)){
      const index = favourites.indexOf(id);
      favourites.splice(index, 1);
    } else {
      favourites.push(id);
    }
    localStorage.setItem(this.favouriteKey, JSON.stringify(favourites));
  }

  getFavourites(): string[]{
    const localStorageEntry = localStorage.getItem(this.favouriteKey);
    if (!localStorageEntry){
      return [];
    }
    return JSON.parse(localStorageEntry);
  }
}

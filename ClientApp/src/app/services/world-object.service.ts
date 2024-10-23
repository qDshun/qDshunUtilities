import { Injectable, WritableSignal, effect, inject, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { WorldObjectFolderResponse, WorldObjectItemResponse } from '../models/response/world-object-response';
import { WorldObject, WorldObjectFolder, WorldObjectItem } from '../models/world-object.model';
import { AnyWorldObject } from './tree-service';

@Injectable({
  providedIn: 'root'
})
export class WorldObjectService {
  private apiService = inject(ApiService);
  private readonly favouriteKey = 'FavouriteWorldObjects';
  public worldObjects: WritableSignal<AnyWorldObject[]> = signal([]);

  public linkedWorldObject: WritableSignal<WorldObject[]> = signal([]);
  constructor() {
    this.getWorldObjects().subscribe(worldObjectDtos =>
      this.worldObjects.set(
        worldObjectDtos.map(wod => wod.type === 'item'
          ? new WorldObjectItem(wod as WorldObjectItemResponse, this.getFavourites())
          : new WorldObjectFolder(wod as WorldObjectFolderResponse, this.getFavourites())
        )
      )
    );

    effect(() => this.linkedWorldObject.set(this.worldObjects()), { allowSignalWrites: true });
  }

  private getWorldObjects(): Observable<(WorldObjectItemResponse | WorldObjectFolderResponse)[]> {
    return of(MOCK_DATA);
  }


  toggleFavourite(id: string) {
    //TODO: use it when updating signal
    const favourites = this.getFavourites();
    if (favourites.includes(id)) {
      const index = favourites.indexOf(id);
      favourites.splice(index, 1);
    } else {
      favourites.push(id);
    }
    localStorage.setItem(this.favouriteKey, JSON.stringify(favourites));
  }

  getFavourites(): string[] {
    const localStorageEntry = localStorage.getItem(this.favouriteKey);
    if (!localStorageEntry) {
      return [];
    }
    return JSON.parse(localStorageEntry);
  }
}

export const URL_MOCK = 'https://media.istockphoto.com/id/1973365581/vector/sample-ink-rubber-stamp.jpg?s=612x612&w=0&k=20&c=_m6hNbFtLdulg3LK5LRjJiH6boCb_gcxPvRLytIz0Ws=';
export const MOCK_DATA: (WorldObjectItemResponse | WorldObjectFolderResponse)[] = [
  {
    type: 'folder',
    id: 'e38b9a22-1111-4c65-9c45-3b41d1f2e93b',
    name: 'emptyFolder',
    path: ''
  },
  {
    type: 'folder',
    id: 'e38b9a22-58b9-4c65-9c45-3b41d1f2e93b',
    name: 'characters',
    path: ''
  },
  {
    type: 'item',
    id: '1',
    name: 'Character 1',
    path: 'characters',
    url: URL_MOCK
  },
  {
    type: 'item',
    id: '2',
    name: 'Character 2',
    path: 'characters',
    url: URL_MOCK
  },
  {
    type: 'item',
    id: '3',
    name: 'Character 3',
    path: 'characters',
    url: URL_MOCK
  },
  {
    type: 'folder',
    id: 'c4a1d9d1-7496-40d1-9dcb-fffd81e1f30f',
    name: 'handouts',
    path: ''
  },
  {
    type: 'item',
    id: '4',
    name: 'Handout 1',
    path: 'handouts',
    url: URL_MOCK
  },
  {
    type: 'item',
    id: '5',
    name: 'Handout 1',
    path: 'handouts',
    url: URL_MOCK
  },
  {
    type: 'folder',
    id: '8b4bcb56-0b7b-4324-b4c1-bb43b4f987a5',
    name: 'withoutBackslash',
    path: ''
  },
  {
    type: 'item',
    id: '6',
    name: 'Character 7',
    path: 'withoutBackslash',
    url: URL_MOCK
  },
  {
    type: 'folder',
    id: '9cf72999-28f4-4a5d-b8ea-9dcbf5dbdf91',
    name: 'asd',
    path: ''
  },
  {
    type: 'folder',
    id: 'c82d2e5c-05e4-49f2-bda5-fc4f0e4c1978',
    name: 'bsd',
    path: 'asd',
  },
  {
    type: 'item',
    id: '7',
    name: 'cds 1',
    path: 'asd/bsd',
    url: URL_MOCK
  },
  {
    type: 'item',
    id: '8',
    name: 'cds 2',
    path: 'asd/bsd',
    url: URL_MOCK
  },
  {
    type: 'item',
    id: '8.0',
    name: 'vne',
    path: 'asd',
    url: URL_MOCK
  },
  {
    type: 'folder',
    id: '0c5c865e-4e6d-4ad9-8f60-5c82d10fa0d5',
    name: 'bss',
    path: 'asd',
  },
  {
    type: 'item',
    id: '9',
    name: 'cds 1',
    path: 'asd/bss',
    url: URL_MOCK
  },
];

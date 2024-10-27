import { Injectable, WritableSignal, effect, inject, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { WorldObjectFolderResponse, WorldObjectItemResponse } from '../models/response/world-object-response';
import { AnyWorldObject, WorldObject, WorldObjectFolder, WorldObjectItem } from '../models/world-object.model';

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
    type: 'item',
    id: 'first-item-id',
    name: 'FirstItem',
    url: URL_MOCK,
    previousId: undefined,
  },
  {
    type: 'folder',
    id: 'emptyFolder-id',
    name: 'emptyFolder',
    previousId: 'first-item-id',
  },
  {
    type: 'folder',
    id: 'characters-id',
    name: 'characters',
    previousId: 'emptyFolder-id',
  },
  {
    type: 'item',
    id: '1',
    name: 'Character 1',
    url: URL_MOCK,
    parentId: 'characters-id',
    previousId: undefined,
  },
  {
    type: 'item',
    id: '2',
    name: 'Character 2',
    url: URL_MOCK,
    parentId: 'characters-id',
    previousId: '1',
  },
  {
    type: 'item',
    id: '3',
    name: 'Character 3',
    url: URL_MOCK,
    parentId: 'characters-id',
    previousId: '2',
  },
  {
    type: 'folder',
    id: 'handouts-id',
    name: 'handouts',
    previousId: 'characters-id',
  },
  {
    type: 'item',
    id: '4',
    name: 'Handout 1',
    url: URL_MOCK,
    parentId: 'handouts-id',
    previousId: undefined,
  },
  {
    type: 'item',
    id: '5',
    name: 'Handout 2',
    url: URL_MOCK,
    parentId: 'handouts-id',
    previousId: '5',
  },
  {
    type: 'folder',
    id: '8b4bcb56-0b7b-4324-b4c1-bb43b4f987a5',
    name: 'withoutBackslash',
    previousId: 'handouts-id'
  },
  {
    type: 'item',
    id: '6',
    name: 'Character 7',
    url: URL_MOCK,
    parentId: '8b4bcb56-0b7b-4324-b4c1-bb43b4f987a5',
    previousId: undefined,
  },
  {
    type: 'folder',
    id: '9cf72999-28f4-4a5d-b8ea-9dcbf5dbdf91',
    name: 'asd',
    previousId: '8b4bcb56-0b7b-4324-b4c1-bb43b4f987a5',
  },
  {
    type: 'folder',
    id: 'c82d2e5c-05e4-49f2-bda5-fc4f0e4c1978',
    name: 'bsd',
    parentId: '9cf72999-28f4-4a5d-b8ea-9dcbf5dbdf91',
    previousId: undefined,
  },
  {
    type: 'item',
    id: '7',
    name: 'cds 1',
    url: URL_MOCK,
    parentId: 'c82d2e5c-05e4-49f2-bda5-fc4f0e4c1978',
    previousId: undefined,
  },
  {
    type: 'item',
    id: '8',
    name: 'cds 2',
    url: URL_MOCK,
    parentId: 'c82d2e5c-05e4-49f2-bda5-fc4f0e4c1978',
    previousId: '7',
  },
  {
    type: 'item',
    id: '8.0',
    name: 'vne',
    parentId: '9cf72999-28f4-4a5d-b8ea-9dcbf5dbdf91',
    url: URL_MOCK,
    previousId: 'c82d2e5c-05e4-49f2-bda5-fc4f0e4c1978',
  },
  {
    type: 'folder',
    id: '0c5c865e-4e6d-4ad9-8f60-5c82d10fa0d5',
    name: 'bss',
    parentId: '9cf72999-28f4-4a5d-b8ea-9dcbf5dbdf91',
    previousId: '8.0',
  },
  {
    type: 'item',
    id: '9',
    name: 'cds 1',
    url: URL_MOCK,
    parentId: '0c5c865e-4e6d-4ad9-8f60-5c82d10fa0d5',
    previousId: undefined,
  },
];

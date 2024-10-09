import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of, ReplaySubject, share, switchMap } from 'rxjs';
import { ApiService } from './api.service';
import { WorldObjectResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class WorldObjectService {
  private apiService = inject(ApiService);

  private worldObjectsUpdated$ = new BehaviorSubject<null>(null);

  worldsOrbjects$ = this.worldObjectsUpdated$.pipe(
    switchMap(() => this.getWorlds()),
    share({ connector: () => new ReplaySubject(1) })
  );

  private getWorlds(): Observable<WorldObjectResponse[]> {
    return of([
      { path: '/characters/Character 1', id: '1', url: 'https://media.istockphoto.com/id/1973365581/vector/sample-ink-rubber-stamp.jpg?s=612x612&w=0&k=20&c=_m6hNbFtLdulg3LK5LRjJiH6boCb_gcxPvRLytIz0Ws=' },
      { path: '/characters/Character 2', id: '2', url: 'https://media.istockphoto.com/id/1973365581/vector/sample-ink-rubber-stamp.jpg?s=612x612&w=0&k=20&c=_m6hNbFtLdulg3LK5LRjJiH6boCb_gcxPvRLytIz0Ws=' },
      { path: '/characters/Character 3', id: '3', url: 'https://media.istockphoto.com/id/1973365581/vector/sample-ink-rubber-stamp.jpg?s=612x612&w=0&k=20&c=_m6hNbFtLdulg3LK5LRjJiH6boCb_gcxPvRLytIz0Ws=' },
      { path: '/handouts/Handout 1', id: '4', url: 'https://media.istockphoto.com/id/1973365581/vector/sample-ink-rubber-stamp.jpg?s=612x612&w=0&k=20&c=_m6hNbFtLdulg3LK5LRjJiH6boCb_gcxPvRLytIz0Ws=' },
      { path: '/handouts/Handout 1', id: '5', url: 'https://media.istockphoto.com/id/1973365581/vector/sample-ink-rubber-stamp.jpg?s=612x612&w=0&k=20&c=_m6hNbFtLdulg3LK5LRjJiH6boCb_gcxPvRLytIz0Ws=' },
      { path: 'withoutBackslash/Character 7', id: '3', url: 'https://media.istockphoto.com/id/1973365581/vector/sample-ink-rubber-stamp.jpg?s=612x612&w=0&k=20&c=_m6hNbFtLdulg3LK5LRjJiH6boCb_gcxPvRLytIz0Ws=' },
      { path: '/asd/bsd/cds 1', id: '3', url: 'https://media.istockphoto.com/id/1973365581/vector/sample-ink-rubber-stamp.jpg?s=612x612&w=0&k=20&c=_m6hNbFtLdulg3LK5LRjJiH6boCb_gcxPvRLytIz0Ws=' },
      { path: '/asd/bsd/cds 2', id: '3', url: 'https://media.istockphoto.com/id/1973365581/vector/sample-ink-rubber-stamp.jpg?s=612x612&w=0&k=20&c=_m6hNbFtLdulg3LK5LRjJiH6boCb_gcxPvRLytIz0Ws=' },
      { path: '/asd/bss/cds 1', id: '3', url: 'https://media.istockphoto.com/id/1973365581/vector/sample-ink-rubber-stamp.jpg?s=612x612&w=0&k=20&c=_m6hNbFtLdulg3LK5LRjJiH6boCb_gcxPvRLytIz0Ws=' },
    ]);
  }
}

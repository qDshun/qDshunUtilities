import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, share, switchMap, tap } from 'rxjs';
import { ApiService } from './api.service';
import { EditWorldRequest } from '../models/edit-world-request';
import { WorldResponse } from '../models/world-response';

@Injectable({
  providedIn: 'root'
})
export class WorldService {
  private apiService = inject(ApiService);

  private worldsUpdated$ = new BehaviorSubject<null>(null);

  worlds$ = this.worldsUpdated$.pipe(
    switchMap(() => this.getWorlds()),
    share({ connector: () => new ReplaySubject(1) })
  );

  private getWorlds(): Observable<WorldResponse[]> {
    return this.apiService.get<WorldResponse[]>('api/world/');
  }

  createWorld(world: EditWorldRequest){
    return this.apiService.post('api/world/', world).pipe(
      tap(() => this.worldsUpdated$.next(null))
    );
  }

  updateWorld(id: string, world: EditWorldRequest){
    return this.apiService.put(`api/world/${id}`, world).pipe(
      tap(() => this.worldsUpdated$.next(null))
    );
  }

  deleteWorld(id: string){
    return this.apiService.delete(`api/world/${id}`).pipe(
      tap(() => this.worldsUpdated$.next(null))
    );
  }
}

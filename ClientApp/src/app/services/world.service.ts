import { Injectable, inject } from "@angular/core";
import { CreateWorldRequest, EditWorldRequest } from "@models/request";
import { WorldResponse } from "@models/response";
import { BehaviorSubject, switchMap, share, ReplaySubject, Observable, tap } from "rxjs";
import { ApiService } from "./api.service";


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
    return this.apiService.get<WorldResponse[]>('world/');
  }

  createWorld(world: CreateWorldRequest) {
    return this.apiService.post('world/', world).pipe(
      tap(() => this.worldsUpdated$.next(null))
    );
  }

  updateWorld(id: string, world: EditWorldRequest) {
    return this.apiService.put(`world/${id}`, world).pipe(
      tap(() => this.worldsUpdated$.next(null))
    );
  }

  deleteWorld(id: string) {
    return this.apiService.delete(`world/${id}`).pipe(
      tap(() => this.worldsUpdated$.next(null))
    );
  }
}

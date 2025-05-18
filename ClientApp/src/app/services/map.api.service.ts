import { inject, Injectable } from "@angular/core";
import { GameComponent } from "@components/game/game/game.component";
import { ApiService } from "./api.service";
import { Observable } from "rxjs";
import { MapDto } from "app/models/response/map.response.model";

@Injectable({
  providedIn: GameComponent
})
export class MapApiService {
  private apiService = inject(ApiService);

  public getMaps(worldId: string): Observable<MapDto[]> {
    return this.apiService.get<MapDto[]>(`map/${worldId}`);
  }

  public createMap(worldId: string, request: any): Observable<void> {
    throw new Error('Not implemented!');
  }

  public deleteMap(worldId: string, mapId: string): Observable<void> {
    throw new Error('Not implemented!');
  }

  public updateMap(worldId: string, mapId: string, request: any): Observable<void> {
    throw new Error('Not implemented!');
  }
}

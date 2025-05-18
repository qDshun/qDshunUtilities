import { inject, Injectable } from "@angular/core";
import { GameComponent } from "@components/game/game/game.component";
import { ApiService } from "./api.service";
import { GetWorldObjectsResponse, WorldObjectResponse } from "@models/response";
import { Observable } from "rxjs";
import { CreateWorldObjectRequest } from "@models/request";

@Injectable({
  providedIn: GameComponent
})
export class WorldObjectApiService {
  private apiService = inject(ApiService);

  public getWorldObjects(worldId: string): Observable<GetWorldObjectsResponse> {
    return this.apiService.get<GetWorldObjectsResponse>(`worldObject/${worldId}`);
  }

  public createWorldObject(worldId: string, request: CreateWorldObjectRequest): Observable<void> {
    return this.apiService.post(`worldObject/${worldId}`, request);
  }

  public getWorldObject(worldId: string): Observable<WorldObjectResponse> {
    return this.apiService.get<WorldObjectResponse>(`worldObject/${worldId}`);
  }

  public deleteWorldObject(worldId: string, worldObjectId: string): Observable<void> {
    return this.apiService.delete(`worldObject/${worldId}/${worldObjectId}`);
  }
}

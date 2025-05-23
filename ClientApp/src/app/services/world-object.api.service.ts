import { inject, Injectable } from "@angular/core";
import { GameComponent } from "@components/game/game/game.component";
import { ApiService } from "./api.service";
import { GetWorldObjectsResponse, WorldObjectResponse } from "@models/response";
import { Observable } from "rxjs";
import { CreateWorldObjectRequest } from "@models/request";
import { Guid } from "app/helpers/guid.type";

@Injectable({
  providedIn: GameComponent
})
export class WorldObjectApiService {
  private apiService = inject(ApiService);

  public getWorldObjects(worldId: Guid): Observable<GetWorldObjectsResponse> {
    return this.apiService.get<GetWorldObjectsResponse>(`worldObject/${worldId}`);
  }

  public createWorldObject(worldId: Guid, request: CreateWorldObjectRequest): Observable<void> {
    return this.apiService.post(`worldObject/${worldId}`, request);
  }

  public getWorldObject(worldId: Guid): Observable<WorldObjectResponse> {
    return this.apiService.get<WorldObjectResponse>(`worldObject/${worldId}`);
  }

  public deleteWorldObject(worldId: Guid, worldObjectId: Guid): Observable<void> {
    return this.apiService.delete(`worldObject/${worldId}/${worldObjectId}`);
  }
}

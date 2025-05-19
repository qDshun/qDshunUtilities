import { inject, Injectable } from "@angular/core";
import { GameComponent } from "@components/game/game/game.component";
import { ApiService } from "./api.service";
import { Observable, of } from "rxjs";
import { MapDto } from "app/models/response/map.response.model";
import { Guid } from "app/helpers/guid.type";

@Injectable({
  providedIn: GameComponent
})
export class MapApiService {
  private apiService = inject(ApiService);

  public getMaps(worldId: Guid): Observable<MapDto[]> {
    return of(this.mapsMock);
    return this.apiService.get<MapDto[]>(`map/${worldId}`);
  }

  public createMap(worldId: Guid, request: any): Observable<void> {
    throw new Error('Not implemented!');
  }

  public deleteMap(worldId: Guid, mapId: Guid): Observable<void> {
    throw new Error('Not implemented!');
  }

  public updateMap(worldId: Guid, mapId: Guid, request: any): Observable<void> {
    throw new Error('Not implemented!');
  }

  private getRandomColor(): string {
    return "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0")
  }

  private mapsMock = JSON.parse(`[
  {
    "id": "6dcd0012-30e3-40a1-89e2-2f1e7b73e6ea",
    "name": "Forest",
    "cellSize": 20,
    "strokeColor": "${this.getRandomColor()}",
    "backgroundColor": "${this.getRandomColor()}",
    "width": 1000,
    "height": 1000,
    "gridType": 1,
    "renderableObjects": [
      {
        "id": "d8e46a64-c6d2-4d11-bc59-13a314b9e5e2",
        "type": 1,
        "imageUrl": "https://files.d20.io/images/367846040/hJolqMhEY78rNstomGaDPg/med.png?1700094567",
        "snapping": {
          "type": "tile",
          "i": 10,
          "j": 10
        },
        "layerType": 2
      },
      {
        "id": "ea57b69c-707b-4b56-8c57-361634d93397",
        "type": 0,
        "imageUrl": "https://picsum.photos/200/300.jpg",
        "snapping": {
          "type": "tile",
          "i": 3,
          "j": 6
        },
        "layerType": 0
      }
    ]
  },
  {
    "id": "d6dc6107-0bb7-45ef-9481-cd69d21c3d8e",
    "name": "Village",
    "cellSize": 20,
    "strokeColor": "${this.getRandomColor()}",
    "backgroundColor": "${this.getRandomColor()}",
    "width": 1200,
    "height": 800,
    "gridType": 2,
    "renderableObjects": [
      {
        "id": "317ac3e2-7e3b-42fd-8d02-87142f3c2a71",
        "type": 1,
        "imageUrl": "https://files.d20.io/images/367846040/hJolqMhEY78rNstomGaDPg/med.png?1700094567",
        "snapping": {
          "type": "tile",
          "i": 8,
          "j": 8
        },
        "layerType": 2
      },
      {
        "id": "5a15659b-3176-4e89-a5fa-47a574b7e988",
        "type": 1,
        "imageUrl": "https://files.d20.io/images/367846040/hJolqMhEY78rNstomGaDPg/med.png?1700094567",
        "snapping": {
          "type": "tile",
          "i": 10,
          "j": 10
        },
        "layerType": 2
      },
      {
        "id": "dcead292-7749-4d9c-9b6e-0fd8a5e40967",
        "type": 0,
        "imageUrl": "https://picsum.photos/200/300.jpg",
        "snapping": {
          "type": "tile",
          "i": 5,
          "j": 4
        },
        "layerType": 0
      }
    ]
  },
  {
    "id": "81a0b537-9d64-464b-a470-7b774e859828",
    "name": "Volcano",
    "cellSize": 20,
    "strokeColor": "${this.getRandomColor()}",
    "backgroundColor": "${this.getRandomColor()}",
    "width": 900,
    "height": 200,
    "gridType": 0,
    "renderableObjects": [
      {
        "id": "99cb7e2b-d179-43c5-a084-7a693faeb91b",
        "type": 1,
        "imageUrl": "https://files.d20.io/images/367846040/hJolqMhEY78rNstomGaDPg/med.png?1700094567",
        "snapping": {
          "type": "tile",
          "i": 10,
          "j": 10
        },
        "layerType": 2
      },
      {
        "id": "a0f5ed85-f3f0-4e3c-9d58-41c3dc6e3703",
        "type": 0,
        "imageUrl": "https://picsum.photos/200/300.jpg",
        "snapping": {
          "type": "tile",
          "i": 6,
          "j": 2
        },
        "layerType": 0
      },
      {
        "id": "bf3dc6a5-487e-417b-a5f0-153d65c74c44",
        "type": 0,
        "imageUrl": "https://picsum.photos/200/300.jpg",
        "snapping": {
          "type": "tile",
          "i": 7,
          "j": 3
        },
        "layerType": 1
      }
    ]
  }
]
`)
}

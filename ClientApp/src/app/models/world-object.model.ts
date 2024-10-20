import { signal, WritableSignal } from "@angular/core";
import { WorldObjectResponse } from "./response/world-object-response";

export class WorldObject {
  id: string;
  path: WritableSignal<string>;
  url: WritableSignal<string>;
  isFavourite: WritableSignal<boolean>;

  constructor(worldObjectDto: WorldObjectResponse, favouriteIds: string[]){
    this.id = worldObjectDto.id;
    this.path = signal(this.removeLeadingSlash(worldObjectDto.path));
    this.url = signal(worldObjectDto.url);
    this.isFavourite = signal(favouriteIds.includes(worldObjectDto.id));
  }

  private removeLeadingSlash(str: string): string {
    if (str.startsWith('/')) {
      return str.substring(1);
    }
    return str;
  }
}

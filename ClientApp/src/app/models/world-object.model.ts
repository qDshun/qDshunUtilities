import { signal, WritableSignal } from "@angular/core";
import { WorldObjectItemResponse, WorldObjectFolderResponse, WorldObjectResponse } from "./response/world-object-response";

export class WorldObject {
  type!: 'folder' | 'item';
  id: string;
  name: WritableSignal<string>;
  parentId: WritableSignal<string | undefined>;
  previousId: WritableSignal<string | undefined>;

  constructor(worldObjectDto: WorldObjectResponse, favouriteIds: string[]) {
    this.id = worldObjectDto.id;
    this.name = signal(worldObjectDto.name);
    this.parentId = signal(worldObjectDto.parentId)
    this.previousId = signal(worldObjectDto.previousId);
  }

  private removeLeadingSlash(str: string): string {
    if (str.startsWith('/')) {
      return str.substring(1);
    }
    return str;
  }
}

export class WorldObjectFolder extends WorldObject {
  constructor(worldObjectDto: WorldObjectFolderResponse, favouriteIds: string[]) {
    super(worldObjectDto, favouriteIds);
    this.type = 'folder';
  }

  public Copy(id: string) {
    return new WorldObjectFolder({ type: this.type, name: this.name(), id, parentId: this.parentId(), previousId: this.previousId() }, []);
  }
}

export class WorldObjectItem extends WorldObject {
  url: WritableSignal<string>;
  isFavourite: WritableSignal<boolean>;

  constructor(worldObjectDto: WorldObjectItemResponse, favouriteIds: string[]) {
    super(worldObjectDto, favouriteIds);
    this.type = 'item';
    this.url = signal(worldObjectDto.url);
    this.isFavourite = signal(favouriteIds.includes(worldObjectDto.id));
  }

  public Copy(id: string) {
    return new WorldObjectItem({ type: this.type, name: this.name(), id, url: this.url(), parentId: this.parentId(), previousId: this.previousId() }, []);
  }
}

export type AnyWorldObject = WorldObjectFolder | WorldObjectItem;

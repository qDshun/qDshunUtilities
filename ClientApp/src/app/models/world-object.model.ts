import { signal, WritableSignal } from "@angular/core";
import { WorldObjectItemResponse, WorldObjectFolderResponse, WorldObjectResponse } from "./response/world-object-response";

export class WorldObject {
  type!: 'folder' | 'item';
  id: string;
  path: WritableSignal<string>;
  name: WritableSignal<string>;

  get fullPath() {
    let fullPath = `${this.path()}/${this.name()}`;
    fullPath = fullPath.startsWith('/') ? fullPath.slice(1) : fullPath;
    return fullPath;
  }

  constructor(worldObjectDto: WorldObjectResponse, favouriteIds: string[]) {
    this.id = worldObjectDto.id;
    this.path = signal(this.removeLeadingSlash(worldObjectDto.path));
    this.name = signal(worldObjectDto.name);
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
    return new WorldObjectFolder({ type: this.type, path: this.path(), name: this.name(), id }, []);
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
    return new WorldObjectItem({ type: this.type, path: this.path(), name: this.name(), id, url: this.url() }, []);
  }
}

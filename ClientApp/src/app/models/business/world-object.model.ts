import { signal, WritableSignal } from "@angular/core";
import { WorldObjectResponse } from "@models/response";
import { WorldObjectType } from "./world-object-type.model";

class WorldObject {
  type!: WorldObjectType;
  id: string;
  name: WritableSignal<string>;
  parentId: WritableSignal<string | null>;
  previousId: WritableSignal<string | null>;
  previewImageUrl: WritableSignal<string | null>;

  constructor(worldObjectDto: WorldObjectResponse) {
    this.id = worldObjectDto.id;
    this.name = signal(worldObjectDto.name);
    this.parentId = signal(worldObjectDto.parentId)
    this.previousId = signal(worldObjectDto.previousId);
    this.previewImageUrl = signal(worldObjectDto.previewImageUrl);
  }
}

export class WorldObjectFolder extends WorldObject {
  constructor(worldObjectDto: WorldObjectResponse) {
    super(worldObjectDto);
    this.type = WorldObjectType.Folder;
  }

  public Copy(id: string) {
    return new WorldObjectFolder({ type: this.type, name: this.name(), id, previewImageUrl: this.previewImageUrl(), parentId: this.parentId(), previousId: this.previousId() });
  }
}

export class WorldObjectCharacter extends WorldObject {
  isFavourite: WritableSignal<boolean>;

  constructor(worldObjectDto: WorldObjectResponse, isFavourite: boolean) {
    super(worldObjectDto);
    this.type = WorldObjectType.CharacterSheet;
    this.isFavourite = signal(isFavourite);
  }

  public Copy(id: string) {
    return new WorldObjectCharacter({ type: this.type, name: this.name(), id, previewImageUrl: this.previewImageUrl(), parentId: this.parentId(), previousId: this.previousId() }, this.isFavourite());
  }
}
export class WorldObjectHandout extends WorldObject {
  isFavourite: WritableSignal<boolean>;

  constructor(worldObjectDto: WorldObjectResponse, isFavourite: boolean) {
    super(worldObjectDto);
    this.type = WorldObjectType.Handout;
    this.isFavourite = signal(isFavourite);
  }

  public Copy(id: string) {
    return new WorldObjectCharacter({ type: this.type, name: this.name(), id, previewImageUrl: this.previewImageUrl(), parentId: this.parentId(), previousId: this.previousId() }, this.isFavourite());
  }
}

export type AnyWorldObject = WorldObjectFolder | WorldObjectCharacter | WorldObjectHandout;

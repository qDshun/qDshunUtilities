import { WorldObjectType } from "@models/business";
import { Guid } from "app/helpers/guid.type";

export class WorldObjectResponse {
  id!: Guid;
  name!: string;
  parentId!: Guid | null;
  previousId!: Guid | null;
  previewImageUrl!: Guid | null;
  type!: WorldObjectType;
}

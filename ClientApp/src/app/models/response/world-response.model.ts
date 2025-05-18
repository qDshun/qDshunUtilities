import { Guid } from "app/helpers/guid.type";

export class WorldResponse {
  id!: Guid;
  name!: string;
  imageUrl!: string;
}

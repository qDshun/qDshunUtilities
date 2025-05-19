import { Guid } from "app/helpers/guid.type";

export class CharacterSheetResponse {
  id!: Guid;
  fields!: CharacterSheetFieldResponse[];
}

export class CharacterSheetFieldResponse {
  id!: Guid;
  name!: string;
  value!: string;
}

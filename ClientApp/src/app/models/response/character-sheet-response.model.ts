export class CharacterSheetResponse {
  id!: string;
  fields!: CharacterSheetFieldResponse[];
}

export class CharacterSheetFieldResponse {
  id!: string;
  name!: string;
  value!: string;
}

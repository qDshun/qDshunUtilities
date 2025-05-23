import { WritableSignal, Signal, signal } from "@angular/core";
import { CharacterSheetResponse } from "@models/response";
import { CharacterSheetField } from "@models/business";


export class CharacterSheet {
  protected _values: WritableSignal<CharacterSheetField[]>;
  public values: Signal<CharacterSheetField[]>;

  constructor(characterSheetResponse: CharacterSheetResponse){
    this._values = signal([]);
    this.values = this._values.asReadonly();
  }
}



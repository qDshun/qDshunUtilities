import { WritableSignal, Signal, signal } from "@angular/core";
import { CharacterSheetFieldResponse } from "@models/response";


export class CharacterSheetField {
  protected _value: WritableSignal<string>;

  public id: string;
  public name: string;
  public value: Signal<string>;

  constructor(fieldResponse: CharacterSheetFieldResponse) {
    this.id = fieldResponse.id;
    this.name = fieldResponse.name;
    this._value = signal(fieldResponse.value);
    this.value = this._value.asReadonly();
  }

  public updateValue(newValue: string) {
    //TODO: change to request
    this._value.set(newValue);
  }
}

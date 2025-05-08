import { Signal, computed } from "@angular/core";
import { CharacterSheetResponse, CharacterSheetFieldResponse } from "@models/response";
import { CharacterSheetField } from "../character-sheet-field.model";
import { CharacterSheet } from "../character-sheet.model";

export class GurpsCharacterSheet extends CharacterSheet {
  constructor(characterSheetResponse: CharacterSheetResponse){
    super(characterSheetResponse);
  }
  public Strength = new MonoDependantGurpsAttribute("ST", 10, 10, this.GET_MOCK_FIELD(), this.GET_MOCK_FIELD()).toInterface();
  public StrikeStrength = new MonoDependantGurpsAttribute("Strike ST", this.Strength, 5, this.GET_MOCK_FIELD(), this.GET_MOCK_FIELD()).toInterface();
  public LiftStrength = new MonoDependantGurpsAttribute("Lift ST", this.Strength, 3, this.GET_MOCK_FIELD(), this.GET_MOCK_FIELD()).toInterface();
  public HealthPoints = new MonoDependantGurpsAttribute("HP", this.Strength, 2, this.GET_MOCK_FIELD(), this.GET_MOCK_FIELD()).toInterface();

  public DX = new MonoDependantGurpsAttribute("DX", 10, 20, this.GET_MOCK_FIELD(), this.GET_MOCK_FIELD()).toInterface();

  public IQ = new MonoDependantGurpsAttribute("IQ", 10, 20, this.GET_MOCK_FIELD(), this.GET_MOCK_FIELD()).toInterface();

  public Perception = new MonoDependantGurpsAttribute("Per", this.IQ, 5, this.GET_MOCK_FIELD(), this.GET_MOCK_FIELD()).toInterface();
  public Vision = new MonoDependantGurpsAttribute("Vis", this.Perception, 2, this.GET_MOCK_FIELD(), this.GET_MOCK_FIELD()).toInterface();
  public Hearing = new MonoDependantGurpsAttribute("Hearing", this.Perception, 2, this.GET_MOCK_FIELD(), this.GET_MOCK_FIELD()).toInterface();
  public Smell = new MonoDependantGurpsAttribute("Smell", this.Perception, 2, this.GET_MOCK_FIELD(), this.GET_MOCK_FIELD()).toInterface();
  public Touch = new MonoDependantGurpsAttribute("Touch", this.Perception, 2, this.GET_MOCK_FIELD(), this.GET_MOCK_FIELD()).toInterface();

  public Willpower = new MonoDependantGurpsAttribute("Will", this.IQ, 5, this.GET_MOCK_FIELD(), this.GET_MOCK_FIELD()).toInterface();
  public Fright = new MonoDependantGurpsAttribute("Fright", this.Willpower, 2, this.GET_MOCK_FIELD(), this.GET_MOCK_FIELD()).toInterface();

  public Health = new MonoDependantGurpsAttribute("HT", 10, 10, this.GET_MOCK_FIELD(), this.GET_MOCK_FIELD()).toInterface();
  public FatiguePoints = new MonoDependantGurpsAttribute("FP", this.Health, 3, this.GET_MOCK_FIELD(), this.GET_MOCK_FIELD()).toInterface();
  public Unconscious = new MonoDependantGurpsAttribute("Unc", this.Health, 2, this.GET_MOCK_FIELD(), this.GET_MOCK_FIELD()).toInterface();
  public Death = new MonoDependantGurpsAttribute("Death", this.Health, 2, this.GET_MOCK_FIELD(), this.GET_MOCK_FIELD()).toInterface();

  basicSpeedFunc = (sheet: GurpsCharacterSheet, expSpent: number, attributeCost: number) =>
    ((sheet.DX.value() + sheet.Health.value()) / 4) + Math.floor(expSpent / attributeCost) * 0.25;

  public BasicSpeed = new MultidependantGurpsAttribute("Basic move", this, 5, this.GET_MOCK_FIELD(), this.GET_MOCK_FIELD(), this.basicSpeedFunc);
  public BasicMove = new MonoDependantGurpsAttribute("Basic move", this.BasicSpeed, 5, this.GET_MOCK_FIELD(), this.GET_MOCK_FIELD()).toInterface();
  private waterMoveFunc = (baseValue: number, expSpent: number, attributeCost: number) => Math.trunc(baseValue / 5) + Math.trunc(expSpent / attributeCost);
  public WaterMove = new MonoDependantGurpsAttribute("Water move", this.BasicMove, 5, this.GET_MOCK_FIELD(), this.GET_MOCK_FIELD(), this.waterMoveFunc);
  private airMoveFunc = (baseValue: number, expSpent: number, attributeCost: number) => Math.trunc(baseValue * 2) + Math.trunc(expSpent / attributeCost);
  public AirMove = new MonoDependantGurpsAttribute("Air move", this.BasicSpeed, 5, this.GET_MOCK_FIELD(), this.GET_MOCK_FIELD(), this.airMoveFunc);
  //TODO: Implement Enhanced move

  private MOCK_ID = 0;
  private GET_MOCK_FIELD(): CharacterSheetField {
    let reponseMock: CharacterSheetFieldResponse = { id: (this.MOCK_ID++).toString(), name: 'test', value: "0" };
    return new CharacterSheetField(reponseMock);
  }
}

abstract class Trainable {
  public expSpent: Signal<number>;

  constructor(expSpentField: CharacterSheetField){
    this.expSpent = computed(() => parseInt(expSpentField.value()));
  }

  updateExpSpend(value: number){
    throw Error('Not implemented!');
  }
}

abstract class Modifiable extends Trainable {
  public modifier: Signal<number>;

  constructor(expSpentField: CharacterSheetField, modifierField: CharacterSheetField){
    super(expSpentField)
    this.modifier = computed(() => parseInt(modifierField.value()));
  }

  updateModifier(value: number){
    throw Error('Not implemented!');
  }
}

abstract class GurpsTrait extends Trainable {
  public name: Signal<string>;

  constructor(expSpentField: CharacterSheetField, nameField: CharacterSheetField) {
    super(expSpentField);
    this.name = computed(() => nameField.value());
  }
}

export interface IGurpsAttribute extends Modifiable {
  name: string,
  value: Signal<number>;
}

class MultidependantGurpsAttribute extends Modifiable {
  public value: Signal<number>;
  constructor(
    public readonly name: string,
    public readonly dependsOn: GurpsCharacterSheet,
    attributeCost: number,
    expSpentField: CharacterSheetField,
    modifierField: CharacterSheetField,
    costFunc: (sheet: GurpsCharacterSheet, expSpent: number, attributeCost: number) => number
  ) {
    super(expSpentField, modifierField);
    this.value = computed(() => costFunc(dependsOn, this.expSpent(), attributeCost) + this.modifier());
  }

  public toInterface() {
    return this as IGurpsAttribute;
  }
}

class MonoDependantGurpsAttribute extends Modifiable {
  public value: Signal<number>;
  constructor(
    public readonly name: string,
    public readonly dependsOn: number | IGurpsAttribute,
    attributeCost: number,
    expSpentField: CharacterSheetField,
    modifierField: CharacterSheetField,
    private costFunc?: ((baseValue: number, expSpent: number, attributeCost: number) => number) | undefined
  ) {
    super(expSpentField, modifierField);
    let costFunction = this.costFunc ?? this.getCostFunc;
    if (typeof dependsOn === 'number'){
      this.value = computed(() => costFunction(dependsOn, this.expSpent(), attributeCost) + this.modifier());
    } else {
      this.value = computed(() => costFunction(dependsOn.value(), this.expSpent(), attributeCost) + this.modifier());
    }
  }
  private getCostFunc = (baseValue: number, expSpent: number, attributeCost: number) => Math.trunc(baseValue) + Math.trunc(expSpent / attributeCost);

  public toInterface() {
    return this as IGurpsAttribute;
  }
}

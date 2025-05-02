import { Signal, computed } from "@angular/core";
import { CharacterSheetResponse, CharacterSheetFieldResponse } from "@models/response";
import { CharacterSheet } from "./character-sheet.model";
import { CharacterSheetField } from "./character-sheet-field.model";


export class GurpsCharacterSheet extends CharacterSheet {
  constructor(characterSheetResponse: CharacterSheetResponse){
    super(characterSheetResponse);
  }
  public Strength = new GurpsAttribute("ST", 10, 10, this.GET_MOCK_FIELD(), this.GET_MOCK_FIELD());
  public StrikeStrength = new GurpsAttribute("Strike ST", this.Strength, 5, this.GET_MOCK_FIELD(), this.GET_MOCK_FIELD());
  public LiftStrength = new GurpsAttribute("Lift ST", this.Strength, 3, this.GET_MOCK_FIELD(), this.GET_MOCK_FIELD());
  public HealthPoints = new GurpsAttribute("HP", this.Strength, 2, this.GET_MOCK_FIELD(), this.GET_MOCK_FIELD());

  public DX = new GurpsAttribute("DX", 10, 20, this.GET_MOCK_FIELD(), this.GET_MOCK_FIELD());

  public IQ = new GurpsAttribute("IQ", 10, 20, this.GET_MOCK_FIELD(), this.GET_MOCK_FIELD());

  public Perception = new GurpsAttribute("Per", this.IQ, 5, this.GET_MOCK_FIELD(), this.GET_MOCK_FIELD());
  public Vision = new GurpsAttribute("Vis", this.Perception, 2, this.GET_MOCK_FIELD(), this.GET_MOCK_FIELD());
  public Hearing = new GurpsAttribute("Hearing", this.Perception, 2, this.GET_MOCK_FIELD(), this.GET_MOCK_FIELD());
  public Smell = new GurpsAttribute("Smell", this.Perception, 2, this.GET_MOCK_FIELD(), this.GET_MOCK_FIELD());
  public Touch = new GurpsAttribute("Touch", this.Perception, 2, this.GET_MOCK_FIELD(), this.GET_MOCK_FIELD());

  public Willpower = new GurpsAttribute("Will", this.IQ, 5, this.GET_MOCK_FIELD(), this.GET_MOCK_FIELD());
  public Fright = new GurpsAttribute("Fright", this.Willpower, 2, this.GET_MOCK_FIELD(), this.GET_MOCK_FIELD());

  public Health = new GurpsAttribute("HT", 10, 10, this.GET_MOCK_FIELD(), this.GET_MOCK_FIELD());
  public FatiguePoints = new GurpsAttribute("FP", this.Health, 3, this.GET_MOCK_FIELD(), this.GET_MOCK_FIELD());
  public Unconscious = new GurpsAttribute("Unc", this.Health, 2, this.GET_MOCK_FIELD(), this.GET_MOCK_FIELD());
  public Death = new GurpsAttribute("Death", this.Health, 2, this.GET_MOCK_FIELD(), this.GET_MOCK_FIELD());

  basicSpeedFunc = (sheet: GurpsCharacterSheet, expSpent: number, attributeCost: number) =>
    ((sheet.DX.value() + sheet.Health.value()) / 4) + Math.floor(expSpent / attributeCost) * 0.25;

  public BasicSpeed = new MultidependantGurpsAttribute("Basic move", this, 5, this.GET_MOCK_FIELD(), this.GET_MOCK_FIELD(), this.basicSpeedFunc);
  public BasicMove = new GurpsAttribute("Basic move", this.BasicSpeed, 5, this.GET_MOCK_FIELD(), this.GET_MOCK_FIELD());
  private waterMoveFunc = (baseValue: number, expSpent: number, attributeCost: number) => Math.trunc(baseValue / 5) + Math.trunc(expSpent / attributeCost);
  public WaterMove = new GurpsAttribute("Water move", this.BasicMove, 5, this.GET_MOCK_FIELD(), this.GET_MOCK_FIELD(), this.waterMoveFunc);
  private airMoveFunc = (baseValue: number, expSpent: number, attributeCost: number) => Math.trunc(baseValue * 2) + Math.trunc(expSpent / attributeCost);
  public AirMove = new GurpsAttribute("Air move", this.BasicSpeed, 5, this.GET_MOCK_FIELD(), this.GET_MOCK_FIELD(), this.airMoveFunc);
  //TODO: Implement Enhanced move

  private MOCK_ID = 0;
  private GET_MOCK_FIELD(): CharacterSheetField {
    let reponseMock: CharacterSheetFieldResponse = { id: (this.MOCK_ID++).toString(), name: 'test', value: "4" };
    return new CharacterSheetField(reponseMock);
  }
}

abstract class Modifiable {
  public modifier: Signal<number>;

  constructor(modifierField: CharacterSheetField){
    this.modifier = computed(() => parseInt(modifierField.value()));
  }

}

abstract class Trainable extends Modifiable {
  public expSpent: Signal<number>;

  constructor(expSpentField: CharacterSheetField, modifierField: CharacterSheetField){
    super(modifierField);
    this.expSpent = computed(() => parseInt(expSpentField.value()));
  }

  updateExpSpend(value: number){
    throw Error('Not implemented!');
  }
}

export interface TrainableGurpsAttribute extends Trainable {
  name: string,
  value: Signal<number>;
}

export class MultidependantGurpsAttribute extends Trainable implements TrainableGurpsAttribute {
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
}

export class GurpsAttribute extends Trainable implements TrainableGurpsAttribute {
  public value: Signal<number>;
  constructor(
    public readonly name: string,
    public readonly dependsOn: number | TrainableGurpsAttribute,
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
}

import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject, filter, interval, map, merge, Subject, take, takeUntil, tap } from 'rxjs';
import { ControlsOf } from '../../../helpers';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { ArmorResult, AvailibleMaterials, HumanBodyParts } from '../../../helpers/armor-crafting';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-gurps-armor-crafting',
  standalone: true,
  imports: [MatIconModule, MatFormFieldModule, ReactiveFormsModule, MatCheckboxModule, MatInputModule, MatSelectModule, MatSliderModule, MatTableModule ],
  templateUrl: './gurps-armor-crafting.component.html',
  styleUrl: './gurps-armor-crafting.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GurpsArmorCraftingComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  private ngUnsubscribe$ = new Subject<void>();

  public svgId = 'human-armor-locations-svg';
  public armorResults$ = new BehaviorSubject<ArmorResult[]>([]);
  public bodyPartUpdated$ = new Subject<void>();
  public humanBodyParts = HumanBodyParts;
  public availibleMaterials = AvailibleMaterials;
  public Math = Math;
  public form: FormGroup<ControlsOf<ArmorCraftingForm>> = this.formBuilder.nonNullable.group({
    isSymmetric: [true, Validators.required],
    materialIndex: [0, Validators.required],
    constructionTypeIndex: [0, Validators.required],
    hp: [10, Validators.required],
    selectedDr: [0, Validators.required],
    crafterMonthlySalary: [1000, Validators.required]
  });

  readonly selectedColor = '#005cbb'
  readonly unselectedColor = 'white'
  readonly strokeColor = 'black'
  readonly displayedColumns = ['id', 'weight', 'surfaceArea', 'constructionType', 'timeToEquip', 'damageResistnce', 'materialCost', 'armorCost', 'workTimeInDays'];

  private svgLoaded$ = interval(100).pipe(
    filter(_ => (document.getElementById(this.svgId)?.children?.length ?? 0) >= this.humanBodyParts.length),
    take(1),
    takeUntil(this.ngUnsubscribe$)
  )

  ngOnInit(): void {
    this.svgLoaded$.subscribe(() => this.registerBodyPartHandlers());
    merge(
      this.form.valueChanges,
      this.bodyPartUpdated$
    ).pipe(
      tap(() => this.updateSliderValue()),
      map(() => this.toArmorResult()),
      tap((armorResult) => this.updateTable(armorResult)),
      takeUntil(this.ngUnsubscribe$)
    ).subscribe()
  }

  public onBodyPartClick(event: MouseEvent) {
    const bodyPartName = (event.target as any).id;
    if (this.form.controls.isSymmetric.value){
      const symmetricBodyPartName = this.getSymmetricBodyPartName(bodyPartName);
      if (symmetricBodyPartName){
        this.selectBodyPart(symmetricBodyPartName);
      }
    }
    this.selectBodyPart(bodyPartName);
    this.bodyPartUpdated$.next();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  registerBodyPartHandlers() {
    this.humanBodyParts.forEach(hbp => {
      const element = document.getElementById(hbp.name);
      if (!element) {
        throw new Error(`Body part is missing: ${hbp.name}`);
      }
      element.onclick = (event) => this.onBodyPartClick(event);
      element.setAttribute('style', `fill: ${this.selectedColor}; stroke: ${this.strokeColor}; stroke-width: 4px;`);
    })
  }

  selectBodyPart(bodyPartName: string) {
    const xmlPathNode = document.querySelector(`#${this.svgId} #${bodyPartName}`);
    const bodyPart = HumanBodyParts.find(hbp => hbp.name == bodyPartName);
    if (!xmlPathNode || !bodyPart) {
      return;
    }
    bodyPart.isSelected = !bodyPart.isSelected
    xmlPathNode.setAttribute('style', `fill: ${bodyPart.isSelected ? this.selectedColor : this.unselectedColor}; stroke: ${this.strokeColor}; stroke-width: 4px;`);
  }

  getSymmetricBodyPartName(bodyPartName: string): string | null{
    if (bodyPartName.includes('left'))
      return bodyPartName.replace('left', 'right');

    if (bodyPartName.includes('right'))
      return bodyPartName.replace('right', 'left');

    return null;
   }

  getHpMultiplier(hp: number){
     //(character’s weight / 150)^(2/3)
     // character’s weight = (hp/2)^3

     const characterWeight = Math.pow(hp/2, 3)
     return Math.pow(characterWeight/150, 2/3)
   }

   updateSliderValue(){
    const minDr = this.availibleMaterials[this.form.controls.materialIndex.value].constructionTypes[this.form.controls.constructionTypeIndex.value].minDr;
    const maxDr = this.availibleMaterials[this.form.controls.materialIndex.value].drMax;
    const currentDr = this.form.controls.selectedDr.value;
    const newDr = Math.min(Math.max(minDr, currentDr), maxDr);
    this.form.controls.selectedDr.patchValue(newDr, {emitEvent: false});
    return newDr;
   }

   toArmorResult(){
    const formValue = this.form.getRawValue();
    const material = this.availibleMaterials[formValue.materialIndex];
    const selectedBodyParts = this.humanBodyParts.filter(hbp => hbp.isSelected)
    const surfaceArea = selectedBodyParts.reduce((partialSum, hbp) => partialSum + hbp.areaCoverage, 0) * this.getHpMultiplier(formValue.hp);
    const constructionType = material.constructionTypes[formValue.constructionTypeIndex];
    const workingDaysInMonth = 25;
    const timeToEquip = constructionType.timeToEquipPerSquareFoot * surfaceArea;
    const damageResistance = formValue.selectedDr;
    const armorWeight = surfaceArea * material.weightModifier * constructionType.weightMultiplier * damageResistance;
    const armorCost = armorWeight * material.workUnitCost * constructionType.costMultiplier;
    const materialCost = armorWeight * material.materialUnitCost * constructionType.costMultiplier;
    const workCost = armorCost - materialCost;
    const workTimeInDays = workCost / formValue.crafterMonthlySalary * workingDaysInMonth;
    const selectedBodyPartNames = selectedBodyParts.map(sbp => sbp.name).join(', ');
    return new ArmorResult(-1, armorWeight, surfaceArea, constructionType, timeToEquip, damageResistance, materialCost, armorCost, workTimeInDays, selectedBodyParts);
    // Armor weight (in pounds) = LSA * WM * CW * DR.
    // Armor cost = armor weight * CM * CC
   }

   private updateTable(armorResult: ArmorResult){
    const previousResultIndex = this.armorResults$.value.findIndex(ar => ar.id == -1);

    if (previousResultIndex != -1){
      this.armorResults$.next([armorResult]);
    } else {
      this.armorResults$.next([this.armorResults$.value[previousResultIndex] = armorResult]);
    }
   }
}

export class ArmorCraftingForm {
  isSymmetric!: boolean;
  materialIndex!: number;
  constructionTypeIndex!: number;
  hp!: number;
  selectedDr!: number;
  crafterMonthlySalary!:number;
}

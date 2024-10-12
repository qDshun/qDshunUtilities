import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject, filter, interval, map, merge, Subject, take, takeUntil, tap } from 'rxjs';
import { ControlsOf } from '../../../helpers';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { ArmorResult, AvailibleMaterials, BodyPart, HumanBodyParts, HumanBodyPartsBack, HumanBodyPartsFront } from '../../../helpers/armor-crafting';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gurps-armor-crafting',
  standalone: true,
  imports: [CommonModule,
    MatIconModule, MatFormFieldModule, ReactiveFormsModule, MatCheckboxModule, MatInputModule, MatSelectModule, MatSliderModule, MatTableModule, MatButtonModule],
  templateUrl: './gurps-armor-crafting.component.html',
  styleUrl: './gurps-armor-crafting.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GurpsArmorCraftingComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);

  public humanBodyParts = [...HumanBodyPartsFront, ...HumanBodyPartsBack];
  public availibleMaterials = AvailibleMaterials;
  public Math = Math;

  public armorResults$ = new BehaviorSubject<ArmorResult[]>([]);
  public currentResult$ = new BehaviorSubject<ArmorResult[]>([]);
  private bodyPartUpdated$ = new Subject<void>();
  private ngUnsubscribe$ = new Subject<void>();
  private initialId = 0;
  private readonly frontSvgId = 'human-armor-locations-front-svg';
  private readonly backSvgId = 'human-armor-locations-back-svg';
  private readonly selectedColor = '#005cbb';
  private readonly unselectedColor = 'white';
  private readonly strokeColor = 'black';

  readonly displayedColumns = ['id', 'weight', 'surfaceArea', 'constructionType', 'timeToEquip', 'damageResistnce', 'materialCost', 'armorCost', 'workTimeInDays'];
  public form: FormGroup<ControlsOf<ArmorCraftingForm>> = this.formBuilder.nonNullable.group({
    leftRightSelectionSymmetryEnabled: [true, Validators.required],
    frontBackSelectionSymmetryEnabled: [true, Validators.required],
    splitFrontAndBack: [true, Validators.required],
    materialIndex: [0, Validators.required],
    constructionTypeIndex: [0, Validators.required],
    hp: [10, Validators.required],
    selectedDr: [0, Validators.required],
    crafterMonthlySalary: [1000, Validators.required]
  });

  private svgLoaded$ = interval(100).pipe(
    filter(_ => (document.getElementById(this.frontSvgId)?.children?.length ?? 0) >= HumanBodyPartsFront.length),
    filter(_ => (document.getElementById(this.backSvgId)?.children?.length ?? 0) >= HumanBodyPartsBack.length),
    take(1),
    takeUntil(this.ngUnsubscribe$)
  )

  ngOnInit(): void {
    this.svgLoaded$.pipe(
      takeUntil(this.ngUnsubscribe$),
      tap(() => this.registerBodyPartHandlers()),
      tap(() => this.updateSliderValue()),
      tap(() => this.setTemporaryArmorResult(this.toArmorResult()))
    )
      .subscribe();

    merge(
      this.form.valueChanges,
      this.bodyPartUpdated$
    ).pipe(
      tap(() => this.updateSliderValue()),
      map(() => this.toArmorResult()),
      tap((armorResult) => this.setTemporaryArmorResult(armorResult)),
      takeUntil(this.ngUnsubscribe$)
    )
      .subscribe()

    this.form.controls.splitFrontAndBack.valueChanges.pipe(
      takeUntil(this.ngUnsubscribe$)
    )
      .subscribe(shouldSplit => this.toggleBodyParts(shouldSplit))
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  public addToResults(armorResult: ArmorResult) {
    const armorResultCopy = { ...armorResult };
    armorResultCopy.id = this.initialId++;
    this.armorResults$.next([...this.armorResults$.value, armorResultCopy]);
  }

  private onBodyPartClick(event: MouseEvent) {
    const bodyPartName = (event.target as any).id;
    const leftRightSymmetryEnabled = this.form.controls.leftRightSelectionSymmetryEnabled.value;
    const frontBackSymmetryEnabled = this.form.controls.frontBackSelectionSymmetryEnabled.value;
    this.selectBodyPart(bodyPartName);
    if (leftRightSymmetryEnabled) {
      this.selectBodyPart(this.getLeftRightSymmetricBodyPartName(bodyPartName));
    }

    if (frontBackSymmetryEnabled) {
      this.selectBodyPart(this.getFrontBackSymmetricBodyPartName(bodyPartName));
    }

    if (leftRightSymmetryEnabled && frontBackSymmetryEnabled) {
      this.selectBodyPart(this.getLeftRightSymmetricBodyPartName(this.getFrontBackSymmetricBodyPartName(bodyPartName)));
    }

    this.bodyPartUpdated$.next();
  }

  private registerBodyPartHandlers() {
    this.humanBodyParts.forEach(hbp => {
      const element = document.getElementById(hbp.name);
      if (!element) {
        throw new Error(`Body part is missing: ${hbp.name}`);
      }
      element.onclick = (event) => this.onBodyPartClick(event);
      element.setAttribute('style', this.getBodyPartStyle(hbp));
    })
  }

  private selectBodyPart(bodyPartName: string | null) {
    const xmlPathNode = document.querySelector(`svg #${bodyPartName}`);
    const bodyPart = this.humanBodyParts.find(hbp => hbp.name == bodyPartName);
    if (!xmlPathNode || !bodyPart) {
      return;
    }
    bodyPart.isSelected = !bodyPart.isSelected
    xmlPathNode.setAttribute('style', this.getBodyPartStyle(bodyPart));
  }


  private getLeftRightSymmetricBodyPartName(bodyPartName: string | null): string | null {
    if (!bodyPartName) {
      return null;
    }

    if (bodyPartName.includes('left'))
      return bodyPartName.replace('left', 'right');

    if (bodyPartName.includes('right'))
      return bodyPartName.replace('right', 'left');

    return null;
  }

  private getBodyPartStyle(bodyPart: BodyPart): string {
    return `fill: ${bodyPart.isSelected ? this.selectedColor : this.unselectedColor}; stroke: ${this.strokeColor}; stroke-width: 4px;`;
  }

  private getFrontBackSymmetricBodyPartName(bodyPartName: string | null): string | null {
    if (!bodyPartName) {
      return null;
    }
    if (bodyPartName.includes('front'))
      return bodyPartName.replace('front', 'back');

    if (bodyPartName.includes('back'))
      return bodyPartName.replace('back', 'front');

    return null;
  }

  private toggleBodyParts(shouldSplit: boolean) {
    if (shouldSplit) {
      this.humanBodyParts = [...HumanBodyPartsBack, ...HumanBodyPartsFront]
    }
    else {
      this.humanBodyParts = HumanBodyParts
    }
    console.log(this.humanBodyParts)
  }

  private getHpMultiplier(hp: number) {
    //(character’s weight / 150)^(2/3)
    // character’s weight = (hp/2)^3

    const characterWeight = Math.pow(hp / 2, 3)
    return Math.pow(characterWeight / 150, 2 / 3)
  }

  private updateSliderValue() {
    const minDr = this.availibleMaterials[this.form.controls.materialIndex.value].constructionTypes[this.form.controls.constructionTypeIndex.value].minDr;
    const maxDr = this.availibleMaterials[this.form.controls.materialIndex.value].drMax;
    const currentDr = this.form.controls.selectedDr.value;
    const newDr = Math.min(Math.max(minDr, currentDr), maxDr);
    this.form.controls.selectedDr.patchValue(newDr, { emitEvent: false });
    return newDr;
  }

  private toArmorResult() {
    const formValue = this.form.getRawValue();
    const material = this.availibleMaterials[formValue.materialIndex];
    const selectedBodyParts = this.humanBodyParts.filter(hbp => hbp.isSelected);
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

  private setTemporaryArmorResult(armorResult: ArmorResult) {
    this.currentResult$.next([armorResult]);
  }
}

export class ArmorCraftingForm {
  leftRightSelectionSymmetryEnabled!: boolean;
  frontBackSelectionSymmetryEnabled!: boolean;
  splitFrontAndBack!: boolean;
  materialIndex!: number;
  constructionTypeIndex!: number;
  hp!: number;
  selectedDr!: number;
  crafterMonthlySalary!: number;
}

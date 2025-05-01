import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";
import { GurpsCharacterSheet } from "@models/business";
import { RollableAttributeComponent } from "../rollable-attribute/rollable-attribute.component";
import { TrainableAttributeComponent } from "../trainable-attribute/trainable-attribute.component";


@Component({
  selector: 'app-gurps-character-sheet[characterSheet]',
  standalone: true,
  imports: [MatTabsModule, RollableAttributeComponent, TrainableAttributeComponent],
  templateUrl: './gurps-character-sheet.component.html',
  styleUrl: './gurps-character-sheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GurpsCharacterSheetComponent {
  @Input({ required: true }) characterSheet!: GurpsCharacterSheet;
}

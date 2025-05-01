import { AsyncPipe } from "@angular/common";
import { Component, ChangeDetectionStrategy, Input, inject } from "@angular/core";
import { GurpsCharacterSheet } from "@models/business";
import { CharacterApiService } from "@services";
import { Observable, map } from "rxjs";
import { GurpsCharacterSheetComponent } from "../gurps/gurps-character-sheet/gurps-character-sheet.component";


@Component({
  selector: 'app-character-sheet-overlay[characterSheetId]',
  standalone: true,
  imports: [GurpsCharacterSheetComponent, AsyncPipe],
  templateUrl: './character-sheet-overlay.component.html',
  styleUrl: './character-sheet-overlay.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharacterSheetOverlayComponent {
  @Input({ required: true }) characterSheetId!: string;
  private characterApiService = inject(CharacterApiService)

  public getCharacterSheet(): Observable<GurpsCharacterSheet> {
    return this.characterApiService.getCharacterSheet(this.characterSheetId).pipe(
      map(response => new GurpsCharacterSheet(response)),
    )
  }
}

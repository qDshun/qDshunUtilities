import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, Input, inject, computed } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { AnyWorldObject, WorldObjectCharacter, WorldObjectType } from "@models/business";
import { CharacterSheetOverlayComponent } from "../character-sheets/character-sheet-overlay/character-sheet-overlay.component";
import { FavouritesService } from "@services";


@Component({
  selector: 'app-world-object[worldObjectNode]',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './world-object.component.html',
  styleUrl: './world-object.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorldObjectComponent {
  private favouritesService = inject(FavouritesService);
  @Input() worldObjectNode!: AnyWorldObject;

  private overlay = inject(Overlay);
  private _overlayRef: OverlayRef | null = null;
  public WorldObjectType = WorldObjectType;
  public isFavouriteStyle = computed(() => `fill: ${(this.worldObjectNode as WorldObjectCharacter).isFavourite() ? 'yellow' : 'rgb(95, 99, 104)'}`);
  public backgroundImageStyle = computed(() =>
    `background: linear-gradient(rgba(35, 36, 39, 0.4), rgba(35, 36, 39, 0.4)), url('${this.worldObjectNode.previewImageUrl()}');
     background-position: center center; background-size: cover;`);

  public toggleFavourite(): void {
    (this.worldObjectNode as WorldObjectCharacter).isFavourite.update(isFavourite => !isFavourite);
    this.favouritesService.toggleFavourite(this.worldObjectNode.id);
  }

  public toggleCharacterSheet(){
    if (this._overlayRef){
      this._overlayRef.detach();
      this._overlayRef = null;
    } else {
      this.openCharacterSheet(this.worldObjectNode.id);
    }
  }

  private openCharacterSheet(id: string) {
    const positionStrategy = this.overlay.position()
      .global()
      .centerVertically()
      .centerHorizontally();

    this._overlayRef = this.overlay.create({
      // height: 800,
      // width: 400,
      positionStrategy
    });
    const characterSheetOverlayPortal = new ComponentPortal(CharacterSheetOverlayComponent);
    const componentPortal = this._overlayRef.attach(characterSheetOverlayPortal);
    componentPortal.instance.characterSheetId = id;
  }
}

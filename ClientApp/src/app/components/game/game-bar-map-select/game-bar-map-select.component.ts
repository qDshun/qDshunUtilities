import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatTabNav, MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-game-bar-map-select',
  standalone: true,
  imports: [MatCardModule, MatTabsModule, MatRippleModule],
  templateUrl: './game-bar-map-select.component.html',
  styleUrl: './game-bar-map-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameBarMapSelectComponent {
  activeLink = "";
  mapsMock = [
    'volcano',
    'forest',
    'village',
    'home',
    'dungeon level 1',
    'volcano',
    'forest',
    'village',
    'home',
    'dungeon level 1',
    'volcano',
    'forest',
    'village',
    'home',
    'dungeon level 1',
    'volcano',
    'forest',
    'village',
    'home',
    'dungeon level 1',
    'volcano',
    'forest',
    'village',
    'home',
    'dungeon level 1',
    'volcano',
    'forest',
    'village',
    'home',
    'dungeon level 1',
    'volcano',
    'forest',
    'village',
    'home',
    'dungeon level 1',
  ]
}

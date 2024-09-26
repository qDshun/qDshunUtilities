import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-game-bar-map-select',
  standalone: true,
  imports: [],
  templateUrl: './game-bar-map-select.component.html',
  styleUrl: './game-bar-map-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameBarMapSelectComponent {

  mapsMock = [
    'volcano',
    'forest',
    'village',
    'home',
    'dungeon level 1',
    'dungeon level 2',
    'dungeon level 3',
    'dungeon level 4',
    'dungeon level 5',
    'dungeon level 6',
    'dungeon level 7',
    'dungeon level 8',
  ]
}

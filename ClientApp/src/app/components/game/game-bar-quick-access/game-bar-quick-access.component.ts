import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WorldObjectListComponent } from '../world-object-list/world-object-list.component';

@Component({
  selector: 'app-game-bar-quick-access',
  standalone: true,
  imports: [WorldObjectListComponent],
  templateUrl: './game-bar-quick-access.component.html',
  styleUrl: './game-bar-quick-access.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameBarQuickAccessComponent {
  // TO BE DISCUSSED
}

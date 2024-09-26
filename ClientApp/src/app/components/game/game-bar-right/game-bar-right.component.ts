import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ChatComponent } from '../chat/chat.component';
import { WorldObjectListComponent } from "../world-object-list/world-object-list.component";

@Component({
  selector: 'app-game-bar-right',
  standalone: true,
  imports: [MatTabsModule, ChatComponent, WorldObjectListComponent],
  templateUrl: './game-bar-right.component.html',
  styleUrl: './game-bar-right.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class GameBarRightComponent {

}

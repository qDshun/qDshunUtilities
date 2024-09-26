import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-world-object-list',
  standalone: true,
  imports: [],
  templateUrl: './world-object-list.component.html',
  styleUrl: './world-object-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorldObjectListComponent {

}

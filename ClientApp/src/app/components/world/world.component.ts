import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-world',
  standalone: true,
  imports: [],
  templateUrl: './world.component.html',
  styleUrl: './world.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorldComponent {
  private activatedRoute = inject(ActivatedRoute);
  worldId = this.activatedRoute.snapshot.params['worldId'];
}

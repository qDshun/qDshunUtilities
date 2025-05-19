import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { Guid } from 'app/helpers/guid.type';

@Component({
  selector: 'app-world',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './world.component.html',
  styleUrl: './world.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorldComponent {
  private activatedRoute = inject(ActivatedRoute);
  worldId = this.activatedRoute.snapshot.params['worldId'];

  private router = inject(Router)

  redirectToGame(worldId: Guid){
    this.router.navigateByUrl(`game/${worldId}`)
  }
}

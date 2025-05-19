import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { WorldResponse } from '@models/response';
import { Guid } from 'app/helpers/guid.type';

@Component({
  selector: 'app-world-card[world]',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './world-card.component.html',
  styleUrl: './world-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorldCardComponent {
  private router = inject(Router);

  @Input() world!: WorldResponse;

  selectWorld(worldId: Guid) {
      this.router.navigateByUrl(`world/${worldId}`);
  }

}


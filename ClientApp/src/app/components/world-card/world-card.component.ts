import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-world-card',
  standalone: true,
  imports: [],
  templateUrl: './world-card.component.html',
  styleUrl: './world-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorldCardComponent {
  @Input() worldName = "";
  private router = inject(Router);
  redirectToWorld(world : string){
      console.log(world);
      this.router.navigateByUrl('/World/' + world, { skipLocationChange: false });
    }
}


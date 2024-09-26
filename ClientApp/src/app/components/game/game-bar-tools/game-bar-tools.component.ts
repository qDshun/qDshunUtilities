import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-bar-tools',
  standalone: true,
  imports: [],
  templateUrl: './game-bar-tools.component.html',
  styleUrl: './game-bar-tools.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameBarToolsComponent {
  private router = inject(Router);

  redirectToHome(){
    this.router.navigateByUrl('/')
  }
}

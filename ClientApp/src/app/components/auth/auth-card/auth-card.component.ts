import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-auth-card',
  standalone: true,
  imports: [],
  templateUrl: './auth-card.component.html',
  styleUrl: './auth-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthCardComponent {

}

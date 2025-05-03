import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IGurpsAttribute } from '@models/business';

@Component({
  selector: 'app-rollable-attribute',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './rollable-attribute.component.html',
  styleUrl: './rollable-attribute.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RollableAttributeComponent {
  @Input({required: true}) attribute!: IGurpsAttribute;
}

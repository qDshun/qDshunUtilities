import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-rollable-trait-row',
  standalone: true,
  imports: [],
  templateUrl: './rollable-trait-row.component.html',
  styleUrl: './rollable-trait-row.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RollableTraitRowComponent {
  @Input({ required: true }) trait!: RollableTrait;
}

export class RollableTrait {
  constructor(public level: number, public name: string) { }
}

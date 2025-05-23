import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorldService } from '@services';
import { WorldCardComponent } from '../world-card/world-card.component';

@Component({
  selector: 'app-world-select',
  standalone: true,
  imports: [WorldCardComponent, CommonModule ],
  templateUrl: './world-select.component.html',
  styleUrl: './world-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorldSelectComponent {
  private worldService = inject(WorldService);
  worlds$ = this.worldService.worlds$;
  ngOnInit(): void {
    this.worlds$.subscribe();
  }
}

import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { WorldService } from '../../../services';

@Component({
  selector: 'app-world-select',
  standalone: true,
  imports: [],
  templateUrl: './world-select.component.html',
  styleUrl: './world-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorldSelectComponent implements OnInit{
  private worldService = inject(WorldService);
  worlds$ = this.worldService.worlds$;
  ngOnInit(): void {
    this.worlds$.subscribe();
  }

}

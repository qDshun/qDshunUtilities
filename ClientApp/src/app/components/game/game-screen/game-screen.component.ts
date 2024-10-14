import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, Inject, ViewChild } from '@angular/core';
import { RenderService } from '../../../services/render.service';
import { filter, fromEvent, tap } from 'rxjs';

@Component({
  selector: 'app-game-screen',
  standalone: true,
  imports: [],
  templateUrl: './game-screen.component.html',
  styleUrl: './game-screen.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameScreenComponent implements AfterViewInit {
  @ViewChild('gameCanvas') _canvas!: ElementRef<HTMLCanvasElement>;

  private renderService = inject(RenderService);

  ngAfterViewInit(): void {

    this.renderService.initialize(this._canvas)
      .subscribe();
  }

  onCanvasClick(event: any) {
    const rect = this._canvas.nativeElement.getBoundingClientRect()
    const canvas_x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const canvas_y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    //TODO: stub
  }
}

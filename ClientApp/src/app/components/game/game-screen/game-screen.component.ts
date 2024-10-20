import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, ViewChild } from '@angular/core';
import { RenderService } from '../../../services/render.service';

@Component({
  selector: 'app-game-screen',
  standalone: true,
  imports: [],
  templateUrl: './game-screen.component.html',
  styleUrl: './game-screen.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameScreenComponent implements AfterViewInit {
  @ViewChild('gameCanvas') _canvas!: ElementRef<HTMLCanvasElement>;

  private destroyRef = inject(DestroyRef);
  private renderService = inject(RenderService);

  ngAfterViewInit(): void {
    this.renderService.initialize(this._canvas, this.destroyRef)
      .subscribe();
  }

  disableContextMenu(event: any) {
    return false;
  }
}

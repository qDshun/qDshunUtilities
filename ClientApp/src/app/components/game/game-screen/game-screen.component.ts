import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, ViewChild } from '@angular/core';
import { GameService } from '../../../services/game.service';

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
  private gameService = inject(GameService);

  ngAfterViewInit(): void {
    this.gameService.initialize(this._canvas, this.destroyRef)
      .subscribe();
  }

  disableContextMenu(event: any) {
    return false;
  }
}

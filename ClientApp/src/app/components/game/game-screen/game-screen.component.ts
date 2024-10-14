import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';

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

  ngAfterViewInit(): void {
    const canvas = this._canvas.nativeElement;
    //TODO: stub
  }

  onCanvasClick(event: any) {
    const rect = this._canvas.nativeElement.getBoundingClientRect()
    const canvas_x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const canvas_y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    //TODO: stub
  }

  private getRandomColor(): string {
    return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
  }
}

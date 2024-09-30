import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WorldObjectResponse } from '../../../models/world-object-response';

@Component({
  selector: 'app-world-object-list',
  standalone: true,
  imports: [DragDropModule],
  templateUrl: './world-object-list.component.html',
  styleUrl: './world-object-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorldObjectListComponent {

  worldObjects: WorldObjectResponse[] = [
    { name: 'Character 1', path: '/characters', id: '1' },
    { name: 'Character 2', path: '/characters', id: '2'  },
    { name: 'Character 3', path: '/characters', id: '3'  },
    { name: 'Handout 1', path: '/handouts', id: '4'  },
    { name: 'Handout 3', path: '/handouts', id: '5'  },
  ]

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.worldObjects, event.previousIndex, event.currentIndex);
  }
}

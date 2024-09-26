import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent {
  messages$ = new ReplaySubject<string[]>(1);

  readonly messagesMock = [
    'Character 1: Hello!',
    'Character 2: Hi!',
    'Character 1: rolled nat 20! Critical hit!',
    'Character 2: We\'re not playing dnd!',
    'Character 1: rolled nat 1! Critical miss!',
    'Character 2: Much better.',
    'Character 1: rolled nat 20! Critical hit!',
    'Character 2: We\'re not playing dnd!',
    'Character 1: rolled nat 1! Critical miss!',
    'Character 2: Much better.',
    'Character 1: rolled nat 20! Critical hit!',
    'Character 2: We\'re not playing dnd!',
    'Character 1: rolled nat 1! Critical miss!',
    'Character 2: Much better.',
    'Character 1: rolled nat 20! Critical hit!',
    'Character 2: We\'re not playing dnd!',
    'Character 1: rolled nat 1! Critical miss!',
    'Character 2: Much better.',
  ]

  constructor(){
    this.messages$.next(this.messagesMock);
  }
}

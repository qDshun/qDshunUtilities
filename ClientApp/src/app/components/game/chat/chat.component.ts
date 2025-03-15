import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { MessageService } from '../../../services/MessageService';

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
  private messageService = inject(MessageService);

  readonly messagesMock = [
    'Character 1: Hello!',
    'Character 2: Hi!',

  ]

  constructor(){
    this.messages$.next(this.messagesMock);
  }
  sendMessage(){
    console.log("called sendMessage");
    this.messageService.sendMessage("Amin", "NAT 20");
  }
}

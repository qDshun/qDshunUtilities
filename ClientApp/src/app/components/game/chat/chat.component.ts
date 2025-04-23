import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, scan, switchMap } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ChatMessage } from '../../../models/chat-message';
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatIconModule, ScrollingModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent {
  public messageService = inject(ChatService);
  private activatedRoute = inject(ActivatedRoute);

  worldId = this.activatedRoute.snapshot.params['worldId'];
  inputValue = "";

  public messages$: Observable<ChatMessage[]>;

  constructor() {
    this.messages$ = this.messageService.getLastMessages(100, this.worldId).pipe(
      switchMap(initialMessages => this.messageService.lastMsg$.pipe(
        scan((acc: ChatMessage[], curr: ChatMessage) => [...acc, curr], initialMessages)
      )
      )
    );
  }

  sendMessage() {
    this.messageService.sendMessage(this.inputValue, this.worldId);
  }
}

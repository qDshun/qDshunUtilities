import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { ChatService } from '../../../services/ChatService';
import { ActivatedRoute } from '@angular/router';
import { Observable, ReplaySubject, scan, startWith, Subject, switchMap, tap } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ChatLine } from '../../../models/chat-line';
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

  public messages$: Observable<ChatLine[]>;

  constructor() {
    console.log("worldId = " + this.worldId);
    this.messages$ = this.messageService.getLastMessages(100, this.worldId).pipe(
      tap(messages => console.log(messages)),
      switchMap(initialMessages => this.messageService.lastMsg$.pipe(
        scan((acc: ChatLine[], curr: ChatLine) => [...acc, curr], initialMessages)
      )
      )
    );
    this.messages$.subscribe(console.log);
  }

  sendMessage() {
    console.log("called sendMessage");
    this.messageService.sendMessage(this.inputValue, this.worldId);
  }
}

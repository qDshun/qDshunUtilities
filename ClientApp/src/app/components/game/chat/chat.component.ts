import { ScrollingModule } from "@angular/cdk/scrolling";
import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { ActivatedRoute } from "@angular/router";
import { ChatMessageResponse } from "@models/response";
import { ChatService } from "@services";
import { Observable, switchMap, scan } from "rxjs";

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

  public messages$: Observable<ChatMessageResponse[]>;

  constructor() {
    this.messages$ = this.messageService.getLastMessages(100, this.worldId).pipe(
      switchMap(initialMessages => this.messageService.lastMsg$.pipe(
        scan((acc: ChatMessageResponse[], curr: ChatMessageResponse) => [...acc, curr], initialMessages)
      )
      )
    );
  }

  sendMessage() {
    this.messageService.sendMessage(this.inputValue, this.worldId);
  }
}

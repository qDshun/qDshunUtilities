import { ScrollingModule } from "@angular/cdk/scrolling";
import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, inject } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { ActivatedRoute } from "@angular/router";
import { ChatService } from "@services";
import { ControlsOf } from "app/helpers/controls-of.type";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatIconModule, ScrollingModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent {
  private readonly messageService = inject(ChatService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);

  private readonly worldId = this.activatedRoute.snapshot.params['worldId'];
  public readonly messages$ = this.messageService.getMessages(this.worldId);

  messageForm: FormGroup<ControlsOf<MessageForm>> = this.formBuilder.nonNullable.group({
    text: ['', Validators.required],
    // fromCharacterId: ['', Validators.required],
  });

  sendMessage() {
    if (this.messageForm.valid && this.messageForm.value.text) {
      this.messageService.sendMessage(this.worldId, this.messageForm.value.text).subscribe();
    }
  }

}
  class MessageForm {
    text!: string;
    // fromCharacterId!: string;
  }

import { inject, Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import * as signalR from "@microsoft/signalr";
import { GetLastMessagesRequest } from '../models/request/get-last-messages-request.model';
import { ChatMessageResponse } from '../models/response/chat-message-reponse.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiService = inject(ApiService);
  private connection!: signalR.HubConnection;
  public lastMsg$ : ReplaySubject<ChatMessageResponse>;

  chatEntries!: ChatMessageResponse[];
  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7297/hub")
    .build();
    this.lastMsg$ = new ReplaySubject();
    this.chatEntries = [];
    this.connection.on("messageReceived", (line : ChatMessageResponse) => {
      this.chatEntries.push(line);
      this.lastMsg$.next(line);

    });
    this.connection.onclose((error) => {
      console.error(`Something went wrong: ${error}`);
  });
    this.connection.start().catch((err) => console.log(err));


  }

  sendMessage(message: string, worldId: string) {
    try {
      this.connection.invoke("newMessage", message, worldId);
    } catch (err) {
        console.error(err);
    }
  }

  getLastMessages(numberOfMessage: number, worldId: string): Observable<ChatMessageResponse[]> {
    const request: GetLastMessagesRequest = {worldId, msgCount: numberOfMessage}
    return this.apiService.post<ChatMessageResponse[]>("Chat", request);
  }
}

import { inject, Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import * as signalR from "@microsoft/signalr";
import { ChatMessage } from '../models/chat-message';
import { ApiService } from './api.service';
import { GetLastMessagesRequest } from '../models/request/get-last-messages-request';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiService = inject(ApiService);
  private connection!: signalR.HubConnection;
  public lastMsg$ : ReplaySubject<ChatMessage>;

  chatEntries!: ChatMessage[];
  constructor() { 
    this.connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7297/hub")
    .build();
    this.lastMsg$ = new ReplaySubject();
    this.chatEntries = [];
    this.connection.on("messageReceived", (line : ChatMessage) => {
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

  getLastMessages(numberOfMessage: number, worldId: string): Observable<ChatMessage[]> {
    return this.apiService.post<ChatMessage[]>("Chat", new GetLastMessagesRequest(numberOfMessage, worldId));
  }
}

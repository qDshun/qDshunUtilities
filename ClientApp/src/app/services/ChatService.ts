import { inject, Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, Subject, ReplaySubject } from 'rxjs';
import * as signalR from "@microsoft/signalr";
import { ChatLine } from '../models/chat-line';
import { ApiService } from './api.service';
import { GetLastMessages } from '../models/request/get-last-messages-request';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiService = inject(ApiService);
  private connection!: signalR.HubConnection;
  public lastMsg$ : ReplaySubject<ChatLine>;

  chatEntries!: ChatLine[];
  constructor() { 
    this.connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7297/hub")
    .build();
    this.lastMsg$ = new ReplaySubject();
    this.chatEntries = [];
    this.connection.on("messageReceived", (line : ChatLine) => {
      console.log("message received: =", line);
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
      this.connection.invoke("newMessage", message, worldId).then(() => (console.log("succesfuly sent")), (reason: any) => (console.log("rejected reason = ", reason)));
    } catch (err) {
        console.error(err);
    }
  }

  getLastMessages(numberOfMessage: number, worldId: string): Observable<ChatLine[]> {
    return this.apiService.post<ChatLine[]>("Chat", new GetLastMessages(numberOfMessage, worldId));
  }
}

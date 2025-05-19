import { inject, Injectable, InjectionToken } from '@angular/core';
import { Observable, ReplaySubject, scan, startWith, switchMap } from 'rxjs';
import * as signalR from "@microsoft/signalr";
import { GetLastMessagesRequest } from '../models/request/get-last-messages-request.model';
import { ChatMessageResponse } from '../models/response/chat-message-reponse.model';
import { ApiService } from './api.service';
import { EventService } from './event.service';
import { Guid } from 'app/helpers/guid.type';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly apiService = inject(ApiService);
  private readonly eventService = inject(EventService)
  private readonly newMessageEventName = 'messageReceived';
  private readonly newMessageMethodName = 'newMessage';


  public getMessages(worldId: Guid) {
    return this.getLastMessages(worldId, 100)
    .pipe(
      switchMap(initialMessages => this.eventService.onEvent<ChatMessageResponse>(this.newMessageEventName).pipe(
        scan((acc: ChatMessageResponse[], curr: ChatMessageResponse) => [...acc, curr], initialMessages),
        startWith(initialMessages)
      ))
    );
  }

  sendMessage(worldId: Guid, message: string): Observable<void> {
    return this.eventService.send<void>(this.newMessageMethodName, message, worldId)
  }

  getLastMessages(worldId: Guid, numberOfMessage: number): Observable<ChatMessageResponse[]> {
    const request: GetLastMessagesRequest = { worldId, msgCount: numberOfMessage }
    return this.apiService.post<ChatMessageResponse[]>("Chat", request);
  }
}

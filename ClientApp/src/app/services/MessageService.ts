import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as signalR from "@microsoft/signalr";
import { HubConnection } from '@microsoft/signalr';



@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private connection!: HubConnection;
  constructor() { 
    this.connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7297/hub")
    .build();

    this.connection.on("messageReceived", (username: string, message: string) => {
      console.log("message received: =", username, message)

    });
    this.connection.start().catch((err) => document.write(err));

  }

  sendMessage(userId: string, message: string) {
    this.connection.send("newMessage", userId, message).then(() => (console.log("succesfuly sent")), (reason: any) => (console.log("rejected reason = ", reason)));
  }


}

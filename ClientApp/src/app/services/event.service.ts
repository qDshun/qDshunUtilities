import { inject, Injectable } from '@angular/core';
import { defer, from, map, Observable, of, switchMap } from 'rxjs';
import * as signalR from "@microsoft/signalr";
import { BASE_URL } from 'app/app.config';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private readonly baseUrl = inject(BASE_URL);

  private hubConnection: signalR.HubConnection | undefined;

  public onEvent<T>(eventName: string): Observable<T> {
    return this.getOrCreateSocket().pipe(
      switchMap(connection => new Observable<T>(observer => {
        connection.on(eventName, arg1 => observer.next(arg1))
      }))
    );
  }

  public send<T>(methodName: string, ...args: any[]): Observable<T>{
    return this.getOrCreateSocket().pipe(
      switchMap(connection => connection.invoke<T>(methodName, ...args))
    )
  }

  private getOrCreateSocket(): Observable<signalR.HubConnection> {
    if (this.hubConnection) {
      return of(this.hubConnection);
    }
    return this.createSocket();
  }

  private createSocket(): Observable<signalR.HubConnection> {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.baseUrl}hub`)
      .build();

    return defer(() =>
      from(connection.start())
        .pipe(
          map(() => connection)
        )
    );
  }
}

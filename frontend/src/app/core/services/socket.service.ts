import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { Idea } from '../models/idea.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.apiUrl, {
      transports: ['websocket'],
    });
  }

  onIdeaAdded(): Observable<Idea> {
    return new Observable(observer => {
      this.socket.on('idea-added', (idea: Idea) => {
        observer.next(idea);
      });
    });
  }

  onIdeaUpdated(): Observable<Idea> {
    return new Observable(observer => {
      this.socket.on('idea-updated', (idea: Idea) => {
        observer.next(idea);
      });
    });
  }

  disconnect() {
    this.socket.disconnect();
  }
}

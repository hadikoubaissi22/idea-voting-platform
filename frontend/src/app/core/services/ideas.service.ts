import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Idea } from '../models/idea.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class IdeasService {
  private apiUrl = `${environment.apiUrl}/api/ideas`;
  private authHeader = 'Basic ' + btoa('admin:securepassword123');

  private get headers() {
    return { 'Authorization': this.authHeader };
  }

  constructor(private http: HttpClient) {}

  getIdeas(): Observable<Idea[]> {
    return this.http.get<Idea[]>(this.apiUrl);
  }


  addIdea(data: { title: string; description: string }) {
    return this.http.post<Idea>(this.apiUrl, data, { headers: this.headers });
  }

  upvote(id: string): Observable<Idea> {
    return this.http.post<Idea>(`${this.apiUrl}/${id}/upvote`, {}, { headers: this.headers });
  }

  downvote(id: string): Observable<Idea> {
    return this.http.post<Idea>(`${this.apiUrl}/${id}/downvote`, {}, { headers: this.headers });
  }

}

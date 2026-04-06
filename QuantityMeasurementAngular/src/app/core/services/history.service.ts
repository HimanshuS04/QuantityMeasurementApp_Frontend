import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private baseUrl = 'http://localhost:5076/api/v1/quantities/history';

  constructor(
    private http: HttpClient,
    private sessionService: SessionService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.sessionService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getMyHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/me`, {
      headers: this.getHeaders()
    });
  }

  getUserHistory(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/user/${userId}`, {
      headers: this.getHeaders()
    });
  }
}
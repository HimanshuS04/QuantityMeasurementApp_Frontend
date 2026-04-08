import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionService } from './session.service';
import { environment } from '../../../environments/environment';


export interface QuantityDto {
  category: string;
  unit: string;
  value: number;
}

@Injectable({
  providedIn: 'root'
})
export class QuantityService {
  // private baseUrl = 'http://localhost:5076/api/v1/quantities';
    private baseUrl = `${environment.apiBaseUrl}/quantities`;


  constructor(
    private http: HttpClient,
    private sessionService: SessionService
  ) {}

  private getHeaders(): HttpHeaders | undefined {
    const token = this.sessionService.getToken();
    if (!token) return undefined;

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  compare(first: QuantityDto, second: QuantityDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/compare`, { first, second }, {
      headers: this.getHeaders()
    });
  }

  convert(quantity: QuantityDto, targetUnit: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/convert`, { quantity, targetUnit }, {
      headers: this.getHeaders()
    });
  }

  add(first: QuantityDto, second: QuantityDto, resultUnit: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, { first, second, resultUnit }, {
      headers: this.getHeaders()
    });
  }

  subtract(first: QuantityDto, second: QuantityDto, resultUnit: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/subtract`, { first, second, resultUnit }, {
      headers: this.getHeaders()
    });
  }

  divide(first: QuantityDto, second: QuantityDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/divide`, { first, second }, {
      headers: this.getHeaders()
    });
  }
}
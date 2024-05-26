import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string
    ) { }

  get<T>(url: string, headers?: HttpHeaders, params?: HttpParams): Observable<T> {
    return this.http.get<T>(this.buildUrl(url), { headers, params });
  }

  post<T>(url: string, payload: object, headers?: HttpHeaders, params?: HttpParams): Observable<T> {
    return this.http.post<T>(this.buildUrl(url), payload, { headers, params });
  }

  put<T>(url: string, payload: object, headers?: HttpHeaders, params?: HttpParams): Observable<T> {
    return this.http.put<T>(this.buildUrl(url), payload, { headers, params });
  }

  delete<T>(url: string, headers?: HttpHeaders, params?: HttpParams): Observable<T> {
    return this.http.delete<T>(this.buildUrl(url), { headers, params });
  }

  buildUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return this.baseUrl + url;
  }

}

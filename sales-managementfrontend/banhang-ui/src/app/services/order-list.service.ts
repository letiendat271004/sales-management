import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderListService {

  private api = 'http://localhost:2644/api/orders';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any[]>(`${this.api}/dto`);
  }
}
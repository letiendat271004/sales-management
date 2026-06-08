import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private api = 'http://localhost:2644/api/orders';

  constructor(private http: HttpClient) {}

  checkout(data: any) {
    return this.http.post<any>(
      `${this.api}/checkout`,
      data
    );
  }
}
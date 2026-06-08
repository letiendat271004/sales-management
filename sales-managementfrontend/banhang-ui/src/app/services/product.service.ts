import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private api = 'http://localhost:2644/api/products';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.api}/dto`, {
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    });
  }

  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }
  create(product: any) {
  return this.http.post(
    'http://localhost:2644/api/products',
    product
  );
}
update(id: number, product: any) {
  return this.http.put(
    `http://localhost:2644/api/products/${id}`,
    product
  );
}
search(keyword: string) {
  return this.http.get<any>(
    `${this.api}/page?keyword=${keyword}&page=0&size=20`
  );
}
paging(page: number, size: number) {
  return this.http.get<any>(
    `${this.api}/page?page=${page}&size=${size}`
  );
}
inventoryValue() {
  return this.http.get<number>(
    `${this.api}/report/inventory-value`
  );
}

reportByCategory() {
  return this.http.get<any[]>(
    `${this.api}/report/category`
  );
}

topSelling() {
  return this.http.get<any[]>(
    `${this.api}/report/top-selling`
  );
}
}
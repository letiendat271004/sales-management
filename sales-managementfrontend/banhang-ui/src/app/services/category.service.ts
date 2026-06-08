import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private api = 'http://localhost:2644/api/categories';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Category[]>(this.api);
  }

  create(category: any) {
    return this.http.post(this.api, category);
  }

  update(id: number, category: any) {
    return this.http.put(`${this.api}/${id}`, category);
  }

  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }
}
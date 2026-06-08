import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './category.html',
  styleUrl: './category.css'
})
export class CategoryComponent implements OnInit {

  categories = signal<Category[]>([]);

  editingId: number | null = null;

  newCategory = {
    name: ''
  };

  constructor(
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
  this.categoryService.getAll()
    .subscribe({
      next: (data) => {
        this.categories.set(data);
      },
      error: (err) => {
        console.error(err);
      }
    });
}

  save(): void {

    if (this.editingId) {

      this.categoryService
        .update(this.editingId, this.newCategory)
        .subscribe({
          next: () => {
            alert('Cập nhật thành công');
            this.loadCategories();
            this.resetForm();
          }
        });

    } else {

      this.categoryService
        .create(this.newCategory)
        .subscribe({
          next: () => {
            alert('Thêm thành công');
            this.loadCategories();
            this.resetForm();
          }
        });

    }
  }

  edit(category: Category): void {

    this.editingId = category.id;

    this.newCategory = {
      name: category.name
    };
  }

  delete(id: number): void {

    if (!confirm('Bạn có chắc muốn xóa?')) {
      return;
    }

    this.categoryService.delete(id).subscribe({
      next: () => {
        alert('Xóa thành công');
        this.loadCategories();
      }
    });
  }

  resetForm(): void {

    this.editingId = null;

    this.newCategory = {
      name: ''
    };
  }
  
}
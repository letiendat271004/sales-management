import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common'; // Đóng vai trò giúp HTML nhận diện chỉ thị [ngClass]
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [FormsModule, NgClass], // Đã bổ sung NgClass để giao diện đồng bộ mượt mà
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
          console.error('Lỗi tải danh mục:', err);
        }
      });
  }

  save(): void {
    // Chặn trường hợp người dùng để trống hoặc chỉ nhập dấu cách
    if (!this.newCategory.name.trim()) {
      alert('Vui lòng nhập tên danh mục sản phẩm!');
      return;
    }

    if (this.editingId) {
      // XỬ LÝ CẬP NHẬT DANH MỤC SẴN CÓ
      this.categoryService
        .update(this.editingId, this.newCategory)
        .subscribe({
          next: () => {
            alert('Cập nhật thành công');
            this.loadCategories();
            this.resetForm();
          },
          error: (err) => {
            console.error('Lỗi cập nhật:', err);
            alert('Cập nhật thất bại, vui lòng thử lại');
          }
        });

    } else {
      // XỬ LÝ THÊM MỚI DANH MỤC
      this.categoryService
        .create(this.newCategory)
        .subscribe({
          next: () => {
            alert('Thêm thành công');
            this.loadCategories();
            this.resetForm();
          },
          error: (err) => {
            console.error('Lỗi thêm mới:', err);
            alert('Thêm mới thất bại');
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
    if (!confirm('Bạn có chắc muốn xóa danh mục này? Hãy đảm bảo không còn sản phẩm nào thuộc danh mục này.')) {
      return;
    }

    this.categoryService.delete(id).subscribe({
      next: () => {
        alert('Xóa thành công');
        this.loadCategories();
        
        // Nếu đang sửa đúng danh mục bị xóa thì reset form luôn
        if (this.editingId === id) {
          this.resetForm();
        }
      },
      error: (err) => {
        console.error('Lỗi xóa danh mục:', err);
        alert('Không thể xóa danh mục này (có thể do ràng buộc dữ liệu sản phẩm)');
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
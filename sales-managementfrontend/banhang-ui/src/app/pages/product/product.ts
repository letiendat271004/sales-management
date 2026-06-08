import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { DecimalPipe } from '@angular/common';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';
@Component({
  selector: 'app-product',
  standalone: true,
 imports: [FormsModule, DecimalPipe],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class ProductComponent implements OnInit {

  products = signal<Product[]>([]);
  editingId: number | null = null;
   keyword: string = '';
   currentPage = 0;
   inventoryValue = 0;

categoryReport: any[] = [];
categories = signal<Category[]>([]);
topSellingProducts: any[] = [];
totalPages = 0;
pageSize = 5;
newProduct = {
    name: '',
    price: 0,
    quantity: 0,
    category: {
      id: 1
    }
    
  };
  constructor(
  private productService: ProductService,
  private categoryService: CategoryService
) {}

ngOnInit(): void {

  this.loadPage(0);

  this.loadInventoryValue();
  this.loadCategoryReport();
  this.loadTopSelling();

  this.loadCategories();
}

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (data: any) => {
        const result = Array.isArray(data) ? data : JSON.parse(data);
        this.products.set(result);
        console.log('PRODUCTS:', this.products());
      },
      error: (err) => {
        console.error('Lỗi gọi API:', err);
      }
    });
  }
  exportPdf(): void {
  window.open('http://localhost:2644/api/reports/products', '_blank');
}
delete(id: number): void {
  if (!confirm('Bạn có chắc muốn xóa sản phẩm này không?')) {
    return;
  }

  this.productService.delete(id).subscribe({
    next: () => {
      alert('Xóa thành công');
      this.loadProducts();
    },
    error: (err) => {
      console.error('Lỗi xóa:', err);
      alert('Xóa thất bại');
    }
  });
}
save(): void {

  if (this.editingId) {

    this.productService
      .update(this.editingId, this.newProduct)
      .subscribe({
        next: () => {
          alert('Cập nhật thành công');
          this.loadProducts();
          this.resetForm();
        },
        error: (err) => {
          console.error(err);
          alert('Cập nhật thất bại');
        }
      });

  } else {

    this.productService
      .create(this.newProduct)
      .subscribe({
        next: () => {
          alert('Thêm thành công');
          this.loadProducts();
          this.resetForm();
        },
        error: (err) => {
          console.error(err);
          alert('Thêm thất bại');
        }
      });
  }
}

resetForm(): void {
  this.editingId = null;

  this.newProduct = {
    name: '',
    price: 0,
    quantity: 0,
    category: {
      id: 1
    }
  };
}
edit(product: any): void {

  this.editingId = product.id;

  this.newProduct = {
    name: product.name,
    price: product.price,
    quantity: product.quantity,
    category: {
      id: 1
    }
  };
}
search(): void {
  this.productService.search(this.keyword)
    .subscribe({
      next: (data) => {
        this.products.set(data.content);
      },
      error: (err) => {
        console.error('Lỗi tìm kiếm:', err);
      }
    });
}
loadPage(page: number): void {

  this.productService
    .paging(page, this.pageSize)
    .subscribe({
      next: (data) => {

        this.products.set(data.content);

        this.currentPage = data.number;
        this.totalPages = data.totalPages;
      },
      error: (err) => {
        console.error(err);
      }
    });
}
loadInventoryValue(): void {
  this.productService.inventoryValue()
    .subscribe(data => {
      this.inventoryValue = data;
    });
}

loadCategoryReport(): void {
  this.productService.reportByCategory()
    .subscribe(data => {
      this.categoryReport = data;
    });
}

loadTopSelling(): void {
  this.productService.topSelling()
    .subscribe(data => {
      this.topSellingProducts = data;
    });
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
}
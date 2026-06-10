import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass, DecimalPipe } from '@angular/common'; // Thêm NgClass và DecimalPipe ở đây
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product } from '../../models/product';
import { Category } from '../../models/category';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [FormsModule, NgClass, DecimalPipe], // Đã khai báo đầy đủ cho template
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class ProductComponent implements OnInit {

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  editingId: number | null = null;
  keyword: string = '';
  selectedFile: File | null = null;
previewImage: string = '';
  // Phân trang
  currentPage = 0;
  totalPages = 0;
  pageSize = 5;

  // Thống kê Dashboard
  inventoryValue = 0;
  categoryReport: any[] = [];
  topSellingProducts: any[] = [];

  // Khởi tạo form dữ liệu
 newProduct = {
  name: '',
  price: 0,
  quantity: 0,
  image: '',
  category: {
    id: 1
  }
};

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    // Tải toàn bộ dữ liệu ban đầu khi vào trang
    this.loadPage(0);
    this.refreshDashboard();
    this.loadCategories();
  }

  // Hàm hỗ trợ làm tươi lại toàn bộ số liệu thống kê trên Dashboard
  refreshDashboard(): void {
    this.loadInventoryValue();
    this.loadCategoryReport();
    this.loadTopSelling();
  }

  loadProducts(): void {
    this.keyword = ''; // Xóa từ khóa tìm kiếm khi bấm tải lại
    this.loadPage(0);  // Quay về trang đầu tiên
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
        // Nếu trang hiện tại không còn sản phẩm nào sau khi xóa (và không phải trang 0), lùi lại 1 trang
        if (this.products().length === 1 && this.currentPage > 0) {
          this.loadPage(this.currentPage - 1);
        } else {
          this.loadPage(this.currentPage);
        }
        this.refreshDashboard();
      },
      error: (err) => {
        console.error('Lỗi xóa:', err);
        alert('Xóa thất bại');
      }
    });
  }

  save(): void {
    // Validate cơ bản trước khi lưu dữ liệu
    if (!this.newProduct.name.trim()) {
      alert('Vui lòng nhập tên sản phẩm');
      return;
    }

    if (this.editingId) {
      // CẬP NHẬT SẢN PHẨM SẴN CÓ
      this.productService
        .update(this.editingId, this.newProduct)
        .subscribe({
          next: () => {
            alert('Cập nhật thành công');
            this.loadPage(this.currentPage); // Giữ nguyên trang đang đứng
            this.refreshDashboard();
            this.resetForm();
          },
          error: (err) => {
            console.error(err);
            alert('Cập nhật thất bại');
          }
        });
    } else {
      // THÊM MỚI SẢN PHẨM
      this.productService
        .create(this.newProduct)
        .subscribe({
          next: () => {
            alert('Thêm thành công');
            this.loadPage(0); // Về trang đầu để thấy sản phẩm mới nhất
            this.refreshDashboard();
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
    image: '',
    category: {
      id: this.categories().length > 0
        ? this.categories()[0].id
        : 1
    }
  };
}

  edit(product: any): void {
    this.editingId = product.id;
    // Lấy ID danh mục động từ sản phẩm đang sửa, nếu không có thì fallback về 1
    const categoryId = product.categoryId || (product.category ? product.category.id : 1);

    this.newProduct = {
  name: product.name,
  price: product.price,
  quantity: product.quantity,
  image: product.image,
  category: {
    id: categoryId
  }
};
  }

  search(): void {
    if (!this.keyword.trim()) {
      this.loadPage(0);
      return;
    }

    this.productService.search(this.keyword)
      .subscribe({
        next: (data) => {
          // Xử lý dữ liệu trả về tùy thuộc vào cấu trúc của API Search (có phân trang hay không)
          if (data && data.content) {
            this.products.set(data.content);
            this.currentPage = data.number || 0;
            this.totalPages = data.totalPages || 1;
          } else if (Array.isArray(data)) {
            this.products.set(data);
            this.currentPage = 0;
            this.totalPages = 1;
          }
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
          console.error('Lỗi phân trang:', err);
        }
      });
  }

  loadInventoryValue(): void {
    this.productService.inventoryValue()
      .subscribe({
        next: (data) => this.inventoryValue = data,
        error: (err) => console.error('Lỗi tải tổng giá trị kho:', err)
      });
  }

  loadCategoryReport(): void {
    this.productService.reportByCategory()
      .subscribe({
        next: (data) => this.categoryReport = data,
        error: (err) => console.error('Lỗi tải báo cáo danh mục:', err)
      });
  }

  loadTopSelling(): void {
    this.productService.topSelling()
      .subscribe({
        next: (data) => this.topSellingProducts = data,
        error: (err) => console.error('Lỗi tải top bán chạy:', err)
      });
  }

  loadCategories(): void {
    this.categoryService.getAll()
      .subscribe({
        next: (data) => {
          this.categories.set(data);
          // Gán mặc định danh mục đầu tiên cho form nếu đang không trong trạng thái sửa
          if (!this.editingId && data.length > 0) {
            this.newProduct.category.id = data[0].id;
          }
        },
        error: (err) => {
          console.error('Lỗi tải danh mục:', err);
        }
      });
  }
  onFileSelected(event: any): void {
  const file = event.target.files[0];

  if (!file) {
    return;
  }

  this.selectedFile = file;

  const reader = new FileReader();

  reader.onload = () => {
    this.previewImage = reader.result as string;
  };

  reader.readAsDataURL(file);

  this.productService.uploadImage(file)
    .subscribe({
      next: (imageUrl) => {
        this.newProduct.image = imageUrl;
      },
      error: (err) => {
        console.error(err);
        alert('Upload ảnh thất bại');
      }
    });
}
}
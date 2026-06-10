import { Component, OnInit, signal } from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-sale',
  standalone: true,
  imports: [DecimalPipe, NgClass, FormsModule],
  templateUrl: './sale.html',
  styleUrl: './sale.css'
})
export class SaleComponent implements OnInit {

  products = signal<Product[]>([]);
  cartItems = signal<any[]>([]);
  customerId = 1;

  selectedProduct: Product | null = null;

  constructor(
    private productService: ProductService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (data: any) => {
        const result = Array.isArray(data) ? data : JSON.parse(data);
        this.products.set(result);
      },
      error: (err) => {
        console.error('Lỗi lấy danh sách sản phẩm:', err);
      }
    });
  }

  viewDetail(product: Product): void {
    this.selectedProduct = product;
  }

  closeDetail(): void {
    this.selectedProduct = null;
  }

  addToCart(product: Product): void {
    if (product.quantity <= 0) {
      alert('Sản phẩm này đã hết hàng trong kho, không thể bán!');
      return;
    }

    const current = [...this.cartItems()];
    const found = current.find(x => x.productId === product.id);

    if (found) {
      if (found.quantity >= product.quantity) {
        alert(`Sản phẩm này trong kho chỉ còn tối đa ${product.quantity} món!`);
        return;
      }

      found.quantity++;
    } else {
      current.push({
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: 1,
        maxStock: product.quantity
      });
    }

    this.cartItems.set(current);
  }

  getTotal(): number {
    return this.cartItems()
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  increase(item: any): void {
    const targetProduct = this.products()
      .find(p => p.id === item.productId);

    const maxStock = targetProduct
      ? targetProduct.quantity
      : item.maxStock;

    if (item.quantity >= maxStock) {
      alert(`Số lượng đạt giới hạn tồn kho tối đa (${maxStock} sản phẩm)!`);
      return;
    }

    item.quantity++;

    this.cartItems.set([
      ...this.cartItems()
    ]);
  }

  decrease(item: any): void {
    if (item.quantity > 1) {
      item.quantity--;

      this.cartItems.set([
        ...this.cartItems()
      ]);
    } else {
      this.removeItem(item.productId);
    }
  }

  removeItem(productId: number): void {
    this.cartItems.set(
      this.cartItems().filter(
        x => x.productId !== productId
      )
    );
  }

  checkout(): void {
    if (this.cartItems().length === 0) {
      alert('Giỏ hàng đang trống');
      return;
    }

    if (!this.customerId || this.customerId <= 0) {
      alert('Vui lòng nhập ID khách hàng hợp lệ!');
      return;
    }

    const request = {
      customerId: this.customerId,
      items: this.cartItems().map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    };

    this.orderService.checkout(request).subscribe({
      next: (order) => {
        alert('🎉 Thanh toán thành công! Đang khởi tạo in hóa đơn...');

        this.cartItems.set([]);

        this.customerId = 1;

        this.loadProducts();

        if (order && order.id) {
          window.open(
            `http://localhost:2644/api/reports/order/${order.id}`,
            '_blank'
          );
        } else {
          console.warn('Không nhận được ID đơn hàng trả về từ API để in hóa đơn.');
        }
      },
      error: (err) => {
        console.error('Lỗi xử lý thanh toán:', err);
        alert('Thanh toán thất bại, vui lòng kiểm tra lại kết nối hệ thống.');
      }
    });
  }
}
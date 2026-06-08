import { Component, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { OrderService } from '../../services/order.service';
@Component({
  selector: 'app-sale',
  standalone: true,
  imports: [DecimalPipe, FormsModule],
  templateUrl: './sale.html',
  styleUrl: './sale.css'
  
})
export class SaleComponent implements OnInit {

  products = signal<Product[]>([]);

  cartItems = signal<any[]>([]);
customerId = 1;
  constructor(
  private productService: ProductService,
  private orderService: OrderService
) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {

    this.productService
      .getAll()
      .subscribe(data => {

        this.products.set(data);

      });
  }

  addToCart(product: Product): void {

    const current = [...this.cartItems()];

    const found = current.find(
      x => x.productId === product.id
    );

    if (found) {

      found.quantity++;

    } else {

      current.push({
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: 1
      });

    }

    this.cartItems.set(current);

  }
  getTotal(): number {

  return this.cartItems()
    .reduce(
      (sum, item) =>
        sum + item.price * item.quantity,
      0
    );
}
increase(item: any): void {

  item.quantity++;

  this.cartItems.set([
    ...this.cartItems()
  ]);
}

decrease(item: any): void {

  if (item.quantity > 1) {

    item.quantity--;

  }

  this.cartItems.set([
    ...this.cartItems()
  ]);
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

  const request = {
    customerId: this.customerId,
    items: this.cartItems().map(item => ({
      productId: item.productId,
      quantity: item.quantity
    }))
  };

  this.orderService.checkout(request)
    .subscribe({
      next: (order) => {
        alert('Thanh toán thành công');

        this.cartItems.set([]);

        this.loadProducts();

        window.open(
          `http://localhost:2644/api/reports/order/${order.id}`,
          '_blank'
        );
      },
      error: (err) => {
        console.error(err);
        alert('Thanh toán thất bại');
      }
    });
}
}
import { Component, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { OrderListService } from '../../services/order-list.service';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './order.html',
  styleUrl: './order.css',
})
export class OrderComponent implements OnInit {

  orders = signal<any[]>([]);

  constructor(
    private orderListService: OrderListService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderListService.getAll()
      .subscribe(data => {
        this.orders.set(data);
      });
  }

  exportInvoice(orderId: number): void {
    window.open(
      `http://localhost:2644/api/reports/order/${orderId}`,
      '_blank'
    );
  }
}
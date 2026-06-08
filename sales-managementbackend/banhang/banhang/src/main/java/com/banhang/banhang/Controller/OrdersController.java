package com.banhang.banhang.Controller;

import com.banhang.banhang.entity.Orders;
import com.banhang.banhang.Service.OrdersService;
import org.springframework.web.bind.annotation.*;
import com.banhang.banhang.dto.OrderResponse;
import java.util.List;
import com.banhang.banhang.dto.OrderRequest;
@RestController
@RequestMapping("/api/orders")
@CrossOrigin("*")
public class OrdersController {

    private final OrdersService service;

    public OrdersController(OrdersService service) {
        this.service = service;
    }

    @GetMapping
    public List<Orders> getAll() {
        return service.getAll();
    }

    @PostMapping
    public Orders create(@RequestBody Orders orders) {
        return service.save(orders);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
    @PutMapping("/{id}/update-total")
    public Orders updateTotal(@PathVariable Integer id) {
        return service.updateTotal(id);
    }
    @GetMapping("/report/revenue")
    public List<Object[]> revenueByDate() {
        return service.revenueByDate();
    }
    @GetMapping("/dto")
    public List<OrderResponse> getAllDto() {
        return service.getAllDto();
    }
    @PostMapping("/checkout")
    public Orders checkout(@RequestBody OrderRequest request) {
        return service.createOrder(request);
    }
}
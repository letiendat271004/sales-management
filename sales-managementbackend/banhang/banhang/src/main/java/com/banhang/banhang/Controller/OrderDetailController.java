package com.banhang.banhang.Controller;

import com.banhang.banhang.Service.OrderDetailService;
import com.banhang.banhang.entity.OrderDetail;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-details")
@CrossOrigin("*")
public class OrderDetailController {

    private final OrderDetailService service;

    public OrderDetailController(OrderDetailService service) {
        this.service = service;
    }

    @GetMapping
    public List<OrderDetail> getAll() {
        return service.getAll();
    }

    @PostMapping
    public OrderDetail create(@RequestBody OrderDetail detail) {
        return service.save(detail);
    }
}
package com.banhang.banhang.Controller;

import com.banhang.banhang.entity.customer;
import com.banhang.banhang.Service.CustomerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin("*")
public class CustomerController {

    private final CustomerService service;

    public CustomerController(CustomerService service) {
        this.service = service;
    }

    @GetMapping
    public List<customer> getAll() {
        return service.getAll();
    }

    @PostMapping
    public customer create(@RequestBody customer customer) {
        return service.save(customer);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}
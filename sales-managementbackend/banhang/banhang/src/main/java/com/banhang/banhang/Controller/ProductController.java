package com.banhang.banhang.Controller;

import com.banhang.banhang.entity.Product;
import com.banhang.banhang.Service.ProductService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import java.util.List;
import com.banhang.banhang.dto.ProductResponse;
import org.springframework.http.MediaType;
@RestController
@RequestMapping(
        value = "/api/products",
        produces = MediaType.APPLICATION_JSON_VALUE
)
@CrossOrigin("*")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping
    public List<Product> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Product getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @PostMapping
    public Product create(@Valid @RequestBody Product product) {
        return service.save(product);
    }

    @PutMapping("/{id}")
    public Product update(
            @PathVariable Integer id,
            @Valid @RequestBody Product product) {
        return service.update(id, product);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
    @GetMapping("/page")
    public Page<ProductResponse> paging(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        return service.pagingDto(keyword, page, size);
    }
    @GetMapping("/report/category")
    public List<Object[]> reportByCategory() {
        return service.countProductByCategory();
    }
    @GetMapping("/report/inventory-value")
    public Double inventoryValue() {
        return service.totalInventoryValue();
    }
    @GetMapping("/report/top-selling")
    public List<Object[]> topSellingProducts() {
        return service.topSellingProducts();
    }
    @GetMapping(value = "/dto", produces = "application/json")
    public List<ProductResponse> getAllDto() {
        return service.getAllDto();
    }
}
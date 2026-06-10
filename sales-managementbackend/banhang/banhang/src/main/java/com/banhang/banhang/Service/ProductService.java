package com.banhang.banhang.Service;

import com.banhang.banhang.entity.Product;
import com.banhang.banhang.Repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import java.util.List;
import com.banhang.banhang.dto.ProductResponse;
@Service
public class ProductService {

    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    public List<Product> getAll() {
        return repository.findAll();
    }

    public Product getById(Integer id) {
        return repository.findById(id).orElse(null);
    }

    public Product save(Product product) {
        return repository.save(product);
    }

    public Product update(Integer id, Product product) {

        Product old = repository.findById(id).orElseThrow();

        old.setName(product.getName());
        old.setPrice(product.getPrice());
        old.setQuantity(product.getQuantity());
        old.setImage(product.getImage());
        return repository.save(old);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }

    public Page<Product> paging(String keyword, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        return repository.findByNameContainingIgnoreCase(
                keyword,
                pageable
        );
    }
    public List<Object[]> countProductByCategory() {
        return repository.countProductByCategory();
    }
    public Double totalInventoryValue() {
        return repository.totalInventoryValue();
    }

    public List<ProductResponse> getAllDto() {

        return repository.findAll()
                .stream()
                .map(product -> new ProductResponse(
                        product.getId(),
                        product.getName(),
                        product.getPrice(),
                        product.getQuantity(),
                        product.getCategory() != null
                                ? product.getCategory().getName()
                                : null,
                        product.getImage()
                ))
                .toList();
    }
    public List<Object[]> topSellingProducts() {
        return repository.topSellingProducts();
    }
    public Page<ProductResponse> pagingDto(String keyword, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        return repository.findByNameContainingIgnoreCase(keyword, pageable)
                .map(product -> new ProductResponse(
                        product.getId(),
                        product.getName(),
                        product.getPrice(),
                        product.getQuantity(),
                        product.getCategory() != null
                                ? product.getCategory().getName()
                                : null,
                        product.getImage()
                ));
    }
}
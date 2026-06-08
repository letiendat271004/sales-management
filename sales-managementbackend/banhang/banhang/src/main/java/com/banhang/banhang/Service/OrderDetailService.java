package com.banhang.banhang.Service;

import com.banhang.banhang.Repository.OrderDetailRepository;
import com.banhang.banhang.Repository.ProductRepository;
import com.banhang.banhang.entity.OrderDetail;
import com.banhang.banhang.entity.Product;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderDetailService {

    private final OrderDetailRepository repository;
    private final ProductRepository productRepository;

    public OrderDetailService(
            OrderDetailRepository repository,
            ProductRepository productRepository) {

        this.repository = repository;
        this.productRepository = productRepository;
    }

    public List<OrderDetail> getAll() {
        return repository.findAll();
    }

    public OrderDetail save(OrderDetail detail) {

        Product product =
                productRepository.findById(
                                detail.getProduct().getId())
                        .orElseThrow();

        if (product.getQuantity() < detail.getQuantity()) {
            throw new RuntimeException("Không đủ hàng trong kho");
        }

        product.setQuantity(
                product.getQuantity() - detail.getQuantity());

        productRepository.save(product);

        return repository.save(detail);
    }
}
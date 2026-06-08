package com.banhang.banhang.Service;

import com.banhang.banhang.Repository.OrderDetailRepository;
import com.banhang.banhang.Repository.OrdersRepository;
import com.banhang.banhang.entity.Orders;
import org.springframework.stereotype.Service;
import com.banhang.banhang.dto.OrderResponse;
import java.util.List;
import com.banhang.banhang.Repository.ProductRepository;
import com.banhang.banhang.dto.OrderRequest;
import com.banhang.banhang.dto.OrderItemRequest;
import com.banhang.banhang.entity.OrderDetail;
import com.banhang.banhang.entity.Product;

import java.time.LocalDateTime;
import java.util.ArrayList;
@Service
public class OrdersService {

    private final OrdersRepository repository;
    private final OrderDetailRepository orderDetailRepository;
    private final ProductRepository productRepository;
    public OrdersService(
            OrdersRepository repository,
            OrderDetailRepository orderDetailRepository, ProductRepository productRepository) {
        this.repository = repository;
        this.orderDetailRepository = orderDetailRepository;
        this.productRepository = productRepository;
    }

    public List<Orders> getAll() {
        return repository.findAll();
    }

    public Orders save(Orders orders) {
        return repository.save(orders);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }

    public Orders updateTotal(Integer orderId) {
        Orders order = repository.findById(orderId).orElseThrow();

        Double total = orderDetailRepository.sumTotalByOrderId(orderId);

        order.setTotal(total == null ? 0 : total);

        return repository.save(order);
    }
    public List<Object[]> revenueByDate() {
        return repository.revenueByDate();
    }
    public List<OrderResponse> getAllDto() {

        return repository.findAll()
                .stream()
                .map(order -> new OrderResponse(
                        order.getId(),
                        order.getCustomerId(),
                        order.getTotal(),
                        order.getDetails() != null
                                ? order.getDetails().size()
                                : 0
                ))
                .toList();
    }
    public Orders createOrder(OrderRequest request) {

        Orders order = new Orders();
        order.setCustomerId(request.getCustomerId());
        order.setOrderDate(LocalDateTime.now());
        order.setTotal(0.0);

        Orders savedOrder = repository.save(order);

        double total = 0;

        for (OrderItemRequest item : request.getItems()) {

            Product product = productRepository
                    .findById(item.getProductId())
                    .orElseThrow();

            if (product.getQuantity() < item.getQuantity()) {
                throw new RuntimeException("Sản phẩm không đủ tồn kho: " + product.getName());
            }

            OrderDetail detail = new OrderDetail();
            detail.setOrder(savedOrder);
            detail.setProduct(product);
            detail.setQuantity(item.getQuantity());
            detail.setPrice(product.getPrice());

            orderDetailRepository.save(detail);

            total += product.getPrice() * item.getQuantity();

            product.setQuantity(product.getQuantity() - item.getQuantity());
            productRepository.save(product);
        }

        savedOrder.setTotal(total);

        return repository.save(savedOrder);
    }
}
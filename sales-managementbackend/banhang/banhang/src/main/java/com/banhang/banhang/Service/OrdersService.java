package com.banhang.banhang.Service;

import com.banhang.banhang.Repository.OrderDetailRepository;
import com.banhang.banhang.Repository.OrdersRepository;
import com.banhang.banhang.entity.Orders;
import org.springframework.stereotype.Service;
import com.banhang.banhang.dto.OrderResponse;
import java.util.List;

@Service
public class OrdersService {

    private final OrdersRepository repository;
    private final OrderDetailRepository orderDetailRepository;

    public OrdersService(
            OrdersRepository repository,
            OrderDetailRepository orderDetailRepository) {
        this.repository = repository;
        this.orderDetailRepository = orderDetailRepository;
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
}
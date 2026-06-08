package com.banhang.banhang.Repository;

import com.banhang.banhang.entity.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {
    List<OrderDetail> findByOrderId(Integer orderId);
    @Query("""
            SELECT SUM(d.quantity * d.price)
            FROM OrderDetail d
            WHERE d.order.id = :orderId
            """)
    Double sumTotalByOrderId(@Param("orderId") Integer orderId);
}
package com.banhang.banhang.Repository;

import com.banhang.banhang.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrdersRepository extends JpaRepository<Orders, Integer> {

    @Query("""
           SELECT CAST(o.orderDate AS date), SUM(o.total)
           FROM Orders o
           GROUP BY CAST(o.orderDate AS date)
           """)
    List<Object[]> revenueByDate();
}
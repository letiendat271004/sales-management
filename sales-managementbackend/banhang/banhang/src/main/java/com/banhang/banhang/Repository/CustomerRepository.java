package com.banhang.banhang.Repository;

import com.banhang.banhang.entity.customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<customer, Integer> {
}
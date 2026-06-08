package com.banhang.banhang.Service;

import com.banhang.banhang.entity.customer;
import com.banhang.banhang.Repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository repository;

    public CustomerService(CustomerRepository repository) {
        this.repository = repository;
    }

    public List<customer> getAll() {
        return repository.findAll();
    }

    public customer save(customer customer) {
        return repository.save(customer);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }
}
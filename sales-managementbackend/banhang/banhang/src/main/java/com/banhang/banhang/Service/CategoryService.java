package com.banhang.banhang.Service;

import com.banhang.banhang.Repository.CategoryRepository;
import com.banhang.banhang.entity.Category;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository repository;

    public CategoryService(CategoryRepository repository) {
        this.repository = repository;
    }

    public List<Category> getAll() {
        return repository.findAll();
    }

    public Category getById(Integer id) {
        return repository.findById(id).orElse(null);
    }

    public Category save(Category category) {
        return repository.save(category);
    }

    public Category update(Integer id, Category category) {
        Category old = repository.findById(id).orElseThrow();

        old.setName(category.getName());

        return repository.save(old);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }
}
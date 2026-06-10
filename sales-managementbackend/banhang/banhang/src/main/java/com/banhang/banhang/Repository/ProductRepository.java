package com.banhang.banhang.Repository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import com.banhang.banhang.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
public interface ProductRepository extends JpaRepository<Product, Integer> {
    Page<Product> findByNameContainingIgnoreCase(
            String keyword,
            Pageable pageable);
    @Query("""
    SELECT c.name, COUNT(p)
    FROM Product p
    JOIN p.category c
    GROUP BY c.name
""")
    List<Object[]> countProductByCategory();
    @Query("""
    SELECT SUM(p.price * p.quantity)
    FROM Product p
""")
    Double totalInventoryValue();
    @Query("""
       SELECT d.product.name, SUM(d.quantity)
       FROM OrderDetail d
       GROUP BY d.product.name
       ORDER BY SUM(d.quantity) DESC
       """)
    List<Object[]> topSellingProducts();
}
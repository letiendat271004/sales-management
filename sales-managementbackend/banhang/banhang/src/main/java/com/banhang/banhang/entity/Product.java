package com.banhang.banhang.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
@Entity
@Table(name = "product")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "Tên sản phẩm không được để trống")
    private String name;

    @NotNull(message = "Giá không được để trống")
    @Positive(message = "Giá phải lớn hơn 0")
    private Double price;

    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 0, message = "Số lượng không được âm")
    private Integer quantity;

    @ManyToOne
    @JoinColumn(name = "category_id")
    @JsonBackReference
    private Category category;

    private String image;
}
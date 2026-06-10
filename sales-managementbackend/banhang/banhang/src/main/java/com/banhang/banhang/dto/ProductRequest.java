package com.banhang.banhang.dto;

import jakarta.validation.constraints.*;

import lombok.Data;

@Data
public class ProductRequest {

    @NotBlank(message = "Tên sản phẩm không được để trống")
    private String name;

    @NotNull(message = "Giá không được để trống")
    @Positive(message = "Giá phải lớn hơn 0")
    private Double price;

    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 0, message = "Số lượng không được âm")
    private Integer quantity;

    @NotNull(message = "Danh mục không được để trống")
    private Integer categoryId;
}
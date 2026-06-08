package com.banhang.banhang.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    private Integer id;

    private String name;

    private Double price;

    private Integer quantity;

    private String categoryName;
}
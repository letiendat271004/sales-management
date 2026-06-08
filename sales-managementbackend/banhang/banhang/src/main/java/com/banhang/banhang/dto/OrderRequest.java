package com.banhang.banhang.dto;

import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {

    private Integer customerId;
    private List<OrderItemRequest> items;
}
package com.banhang.banhang.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

    private Integer orderId;

    private Integer customerId;

    private Double total;

    private Integer itemCount;
}
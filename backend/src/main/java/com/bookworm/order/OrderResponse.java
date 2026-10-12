package com.bookworm.order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        long id,
        String customerName,
        String email,
        String address,
        String city,
        String postalCode,
        String paymentMethod,
        BigDecimal subtotal,
        int rewardPointsUsed,
        int rewardPointsEarned,
        BigDecimal total,
        String status,
        LocalDateTime createdAt,
        List<Item> items) {

    public record Item(long bookId, String title, String author, BigDecimal unitPrice, int quantity) {
    }
}

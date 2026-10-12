package com.bookworm.order;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CheckoutRequest(
        @NotBlank @Size(max = 120) String customerName,
        @NotBlank @Email @Size(max = 180) String email,
        @NotBlank @Size(max = 40) String phone,
        @NotBlank @Size(max = 240) String address,
        @NotBlank @Size(max = 100) String city,
        @NotBlank @Size(max = 30) String postalCode,
        @NotBlank String paymentMethod,
        @Min(0) int rewardPointsToUse,
        @NotEmpty List<@Valid OrderLineRequest> items) {

    public record OrderLineRequest(@Min(1) long bookId, @NotNull @Min(1) Integer quantity) {
    }
}

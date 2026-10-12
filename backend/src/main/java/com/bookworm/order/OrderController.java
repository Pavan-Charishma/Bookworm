package com.bookworm.order;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orders;

    public OrderController(OrderService orders) {
        this.orders = orders;
    }

    @PostMapping
    public OrderResponse placeOrder(@Valid @RequestBody CheckoutRequest request) {
        return orders.placeOrder(request);
    }

    @GetMapping
    public List<OrderResponse> findOrders(@RequestParam @NotBlank @Email String email) {
        return orders.findByEmail(email);
    }

    @PutMapping("/{id}/cancel")
    public OrderResponse cancelOrder(@PathVariable long id, @RequestParam @NotBlank @Email String email) {
        return orders.cancelOrder(id, email);
    }
}

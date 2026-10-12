package com.bookworm.order;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class OrderService {
    private static final Set<String> PAYMENT_METHODS = Set.of("CARD", "PAYPAL", "CASH_ON_DELIVERY");
    private static final BigDecimal POINT_VALUE = BigDecimal.ONE;
    private static final RowMapper<OrderResponse.Item> ITEM_ROW = (row, number) -> new OrderResponse.Item(
            row.getLong("book_id"),
            row.getString("title"),
            row.getString("author"),
            row.getBigDecimal("unit_price"),
            row.getInt("quantity"));

    private final JdbcTemplate jdbc;
    private final SimpleJdbcInsert orderInsert;

    public OrderService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
        this.orderInsert = new SimpleJdbcInsert(jdbc)
                .withTableName("orders")
                .usingColumns("customer_name", "email", "phone", "address", "city", "postal_code",
                        "payment_method", "subtotal", "reward_points_used", "reward_points_earned", "total", "status")
                .usingGeneratedKeyColumns("id");
    }

    @Transactional
    public OrderResponse placeOrder(CheckoutRequest request) {
        String email = request.email().trim().toLowerCase();
        if (!PAYMENT_METHODS.contains(request.paymentMethod())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Choose a supported demo payment method");
        }

        List<PricedItem> items = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;
        for (CheckoutRequest.OrderLineRequest requested : request.items()) {
            BookPrice book = jdbc.query("SELECT id, title, author, price FROM books WHERE id = ?",
                            (row, number) -> new BookPrice(
                                    row.getLong("id"),
                                    row.getString("title"),
                                    row.getString("author"),
                                    row.getBigDecimal("price")),
                            requested.bookId())
                    .stream()
                    .findFirst()
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "A selected book no longer exists"));
            BigDecimal lineTotal = book.price().multiply(BigDecimal.valueOf(requested.quantity()));
            subtotal = subtotal.add(lineTotal);
            items.add(new PricedItem(book, requested.quantity()));
        }

        int availablePoints = availablePoints(email);
        if (request.rewardPointsToUse() > availablePoints) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Not enough reward points");
        }
        BigDecimal discount = POINT_VALUE.multiply(BigDecimal.valueOf(request.rewardPointsToUse()));
        if (discount.compareTo(subtotal) > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reward points cannot exceed the order subtotal");
        }
        BigDecimal total = subtotal.subtract(discount).setScale(2, RoundingMode.HALF_UP);
        int pointsEarned = total.divideToIntegralValue(new BigDecimal("100")).intValue();

        MapSqlParameterSource orderValues = new MapSqlParameterSource()
                .addValue("customer_name", request.customerName().trim())
                .addValue("email", email)
                .addValue("phone", request.phone().trim())
                .addValue("address", request.address().trim())
                .addValue("city", request.city().trim())
                .addValue("postal_code", request.postalCode().trim())
                .addValue("payment_method", request.paymentMethod())
                .addValue("subtotal", subtotal)
                .addValue("reward_points_used", request.rewardPointsToUse())
                .addValue("reward_points_earned", pointsEarned)
                .addValue("total", total)
                .addValue("status", "PLACED");
        Number orderId = orderInsert.executeAndReturnKey(orderValues);

        for (PricedItem item : items) {
            jdbc.update("""
                    INSERT INTO order_items (order_id, book_id, title, author, unit_price, quantity)
                    VALUES (?, ?, ?, ?, ?, ?)
                    """,
                    orderId.longValue(),
                    item.book().id(),
                    item.book().title(),
                    item.book().author(),
                    item.book().price(),
                    item.quantity());
        }
        return findOrder(orderId.longValue());
    }

    public List<OrderResponse> findByEmail(String suppliedEmail) {
        String email = suppliedEmail.trim().toLowerCase();
        List<OrderHeader> orders = jdbc.query("""
                SELECT id, customer_name, email, address, city, postal_code, payment_method,
                       subtotal, reward_points_used, reward_points_earned, total, status, created_at
                FROM orders WHERE email = ? ORDER BY created_at DESC
                """, (row, number) -> mapHeader(row), email);
        return orders.stream().map(order -> toResponse(order, findItems(order.id()))).toList();
    }

    @Transactional
    public OrderResponse cancelOrder(long id, String suppliedEmail) {
        OrderHeader order = findHeader(id);
        if (!order.email().equalsIgnoreCase(suppliedEmail.trim())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found");
        }
        if (!"PLACED".equals(order.status())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This order can no longer be cancelled");
        }
        if (order.createdAt().isBefore(LocalDateTime.now().minusHours(48))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Orders can only be cancelled within 48 hours");
        }
        jdbc.update("UPDATE orders SET status = 'CANCELLED' WHERE id = ?", id);
        return findOrder(id);
    }

    public int availablePoints(String suppliedEmail) {
        Integer points = jdbc.queryForObject("""
                SELECT COALESCE(SUM(reward_points_earned - reward_points_used), 0)
                FROM orders WHERE email = ? AND status <> 'CANCELLED'
                """, Integer.class, suppliedEmail.trim().toLowerCase());
        return points == null ? 0 : points;
    }

    private OrderResponse findOrder(long id) {
        return toResponse(findHeader(id), findItems(id));
    }

    private OrderHeader findHeader(long id) {
        return jdbc.query("""
                SELECT id, customer_name, email, address, city, postal_code, payment_method,
                       subtotal, reward_points_used, reward_points_earned, total, status, created_at
                FROM orders WHERE id = ?
                """, (row, number) -> mapHeader(row), id)
                .stream()
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
    }

    private OrderHeader mapHeader(java.sql.ResultSet row) throws java.sql.SQLException {
        Timestamp createdAt = row.getTimestamp("created_at");
        return new OrderHeader(
                row.getLong("id"),
                row.getString("customer_name"),
                row.getString("email"),
                row.getString("address"),
                row.getString("city"),
                row.getString("postal_code"),
                row.getString("payment_method"),
                row.getBigDecimal("subtotal"),
                row.getInt("reward_points_used"),
                row.getInt("reward_points_earned"),
                row.getBigDecimal("total"),
                row.getString("status"),
                createdAt.toLocalDateTime());
    }

    private List<OrderResponse.Item> findItems(long orderId) {
        return jdbc.query("SELECT book_id, title, author, unit_price, quantity FROM order_items WHERE order_id = ?",
                ITEM_ROW, orderId);
    }

    private OrderResponse toResponse(OrderHeader order, List<OrderResponse.Item> items) {
        return new OrderResponse(
                order.id(),
                order.customerName(),
                order.email(),
                order.address(),
                order.city(),
                order.postalCode(),
                order.paymentMethod(),
                order.subtotal(),
                order.rewardPointsUsed(),
                order.rewardPointsEarned(),
                order.total(),
                order.status(),
                order.createdAt(),
                items);
    }

    private record BookPrice(long id, String title, String author, BigDecimal price) {
    }

    private record PricedItem(BookPrice book, int quantity) {
    }

    private record OrderHeader(
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
            LocalDateTime createdAt) {
    }
}

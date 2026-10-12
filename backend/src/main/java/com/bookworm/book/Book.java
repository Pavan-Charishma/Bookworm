package com.bookworm.book;

import java.math.BigDecimal;

public record Book(
        long id,
        String title,
        String author,
        String category,
        String publisher,
        String format,
        BigDecimal price,
        String description,
        String coverColor) {
}

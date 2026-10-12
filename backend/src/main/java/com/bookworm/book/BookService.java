package com.bookworm.book;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

@Service
public class BookService {
    private static final RowMapper<Book> BOOK_ROW = (row, number) -> new Book(
            row.getLong("id"),
            row.getString("title"),
            row.getString("author"),
            row.getString("category"),
            row.getString("publisher"),
            row.getString("format"),
            row.getBigDecimal("price"),
            row.getString("description"),
            row.getString("cover_color"));

    private final JdbcTemplate jdbc;

    public BookService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public List<Book> findBooks(
            String search,
            String category,
            String publisher,
            String format,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String sort) {
        StringBuilder sql = new StringBuilder("SELECT * FROM books WHERE 1=1");
        List<Object> values = new ArrayList<>();

        addFilter(sql, values, " AND category = ?", category);
        addFilter(sql, values, " AND publisher = ?", publisher);
        addFilter(sql, values, " AND format = ?", format);
        if (search != null && !search.isBlank()) {
            sql.append(" AND (LOWER(title) LIKE ? OR LOWER(author) LIKE ?)");
            String term = "%" + search.trim().toLowerCase() + "%";
            values.add(term);
            values.add(term);
        }
        if (minPrice != null) {
            sql.append(" AND price >= ?");
            values.add(minPrice);
        }
        if (maxPrice != null) {
            sql.append(" AND price <= ?");
            values.add(maxPrice);
        }

        sql.append(switch (sort == null ? "" : sort) {
            case "price-asc" -> " ORDER BY price ASC, title ASC";
            case "price-desc" -> " ORDER BY price DESC, title ASC";
            case "title" -> " ORDER BY title ASC";
            default -> " ORDER BY category ASC, title ASC";
        });
        Map<String, Integer> booksPerCategory = new HashMap<>();
        return jdbc.query(sql.toString(), BOOK_ROW, values.toArray()).stream()
                .filter(book -> booksPerCategory.merge(book.category(), 1, Integer::sum) <= 2)
                .toList();
    }

    public Optional<Book> findById(long id) {
        return jdbc.query("SELECT * FROM books WHERE id = ?", BOOK_ROW, id).stream().findFirst();
    }

    private void addFilter(StringBuilder sql, List<Object> values, String clause, String value) {
        if (value != null && !value.isBlank()) {
            sql.append(clause);
            values.add(value);
        }
    }
}

package com.bookworm;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class BookstoreApiTest {
    @Autowired
    private MockMvc mvc;

    @Autowired
    private JdbcTemplate jdbc;

    @Test
    void seedsTwoBooksInEachCategoryAndFiltersTheCatalogue() throws Exception {
        assertThat(jdbc.queryForList(
                "SELECT category FROM books GROUP BY category HAVING COUNT(*) <> 2", String.class)).isEmpty();
        assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM books", Integer.class)).isEqualTo(10);
        assertThat(jdbc.queryForObject("SELECT price FROM books WHERE id = 1", java.math.BigDecimal.class))
                .isEqualByComparingTo("399");

        mvc.perform(get("/api/books"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(10));
        mvc.perform(get("/api/books").param("category", "Fantasy").param("sort", "price-asc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].category").value("Fantasy"));
    }

    @Test
    void placesLoadsAndCancelsAnOrderAndTracksRewardPoints() throws Exception {
        String checkout = """
                {
                  "customerName":"Demo Reader",
                  "email":"reader@example.com",
                  "phone":"555-0100",
                  "address":"12 Story Lane",
                  "city":"Booktown",
                  "postalCode":"10001",
                  "paymentMethod":"CARD",
                  "rewardPointsToUse":0,
                  "items":[{"bookId":1,"quantity":2}]
                }
                """;

        String response = mvc.perform(post("/api/orders")
                        .contentType("application/json")
                        .content(checkout))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(798))
                .andExpect(jsonPath("$.items[0].quantity").value(2))
                .andExpect(jsonPath("$.rewardPointsEarned").value(7))
                .andReturn()
                .getResponse()
                .getContentAsString();
        Number orderId = com.jayway.jsonpath.JsonPath.read(response, "$.id");

        mvc.perform(get("/api/orders").param("email", "reader@example.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));

        mvc.perform(put("/api/orders/{id}/cancel", orderId.longValue()).param("email", "reader@example.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CANCELLED"));
    }

    @Test
    void registersAndAuthenticatesDemoAccounts() throws Exception {
        String account = """
                {"name":"Reader One","email":"one@example.com","password":"simplepass"}
                """;
        mvc.perform(post("/api/accounts/register")
                        .contentType("application/json")
                        .content(account))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Reader One"));

        mvc.perform(post("/api/accounts/login")
                        .contentType("application/json")
                        .content("""
                                {"email":"one@example.com","password":"simplepass"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("one@example.com"));
    }
}

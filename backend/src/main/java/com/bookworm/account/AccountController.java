package com.bookworm.account;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {
    private final JdbcTemplate jdbc;
    private final PasswordEncoder passwordEncoder;

    public AccountController(JdbcTemplate jdbc, PasswordEncoder passwordEncoder) {
        this.jdbc = jdbc;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public AccountResponse register(@Valid @RequestBody AccountRequest request) {
        String email = request.email().trim().toLowerCase();
        Integer count = jdbc.queryForObject("SELECT COUNT(*) FROM accounts WHERE email = ?", Integer.class, email);
        if (count != null && count > 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account already uses this email");
        }
        jdbc.update("INSERT INTO accounts (name, email, password_hash) VALUES (?, ?, ?)",
                request.name().trim(), email, passwordEncoder.encode(request.password()));
        return new AccountResponse(request.name().trim(), email);
    }

    @PostMapping("/login")
    public AccountResponse login(@Valid @RequestBody LoginRequest request) {
        String email = request.email().trim().toLowerCase();
        return jdbc.query("SELECT name, email, password_hash FROM accounts WHERE email = ?",
                        (row, number) -> new SavedAccount(
                                row.getString("name"), row.getString("email"), row.getString("password_hash")),
                        email)
                .stream()
                .filter(account -> passwordEncoder.matches(request.password(), account.passwordHash()))
                .findFirst()
                .map(account -> new AccountResponse(account.name(), account.email()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email or password is incorrect"));
    }

    public record AccountRequest(
            @NotBlank @Size(max = 120) String name,
            @NotBlank @Email @Size(max = 180) String email,
            @NotBlank @Size(min = 6, max = 100) String password) {
    }

    public record LoginRequest(
            @NotBlank @Email @Size(max = 180) String email,
            @NotBlank String password) {
    }

    public record AccountResponse(String name, String email) {
    }

    private record SavedAccount(String name, String email, String passwordHash) {
    }
}

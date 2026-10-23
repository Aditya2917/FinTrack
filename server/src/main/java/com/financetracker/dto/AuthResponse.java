package com.financetracker.dto;

public class AuthResponse {
    private String token;
    private Long id;
    private String name;
    private String email;
    private String currency;

    public AuthResponse(String token, Long id, String name, String email, String currency) {
        this.token = token;
        this.id = id;
        this.name = name;
        this.email = email;
        this.currency = currency;
    }

    public String getToken() { return token; }
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getCurrency() { return currency; }
}

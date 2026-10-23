package com.financetracker.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "budgets")
public class Budget {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private Double amountLimit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    public Budget() {}

    public Budget(String category, Double amountLimit, User user) {
        this.category = category;
        this.amountLimit = amountLimit;
        this.user = user;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getAmountLimit() { return amountLimit; }
    public void setAmountLimit(Double amountLimit) { this.amountLimit = amountLimit; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}

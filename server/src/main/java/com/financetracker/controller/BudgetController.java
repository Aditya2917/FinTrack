package com.financetracker.controller;

import com.financetracker.entity.Budget;
import com.financetracker.repository.BudgetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    @Autowired
    private BudgetRepository budgetRepository;

    @GetMapping
    public ResponseEntity<Map<String, Double>> getBudgets() {
        List<Budget> budgets = budgetRepository.findAll();
        Map<String, Double> map = new HashMap<>();
        for (Budget b : budgets) {
            map.put(b.getCategory(), b.getAmountLimit());
        }
        return ResponseEntity.ok(map);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> setBudget(@RequestBody Map<String, Object> payload) {
        String category = (String) payload.get("category");
        Number limitNum = (Number) payload.get("limit");
        Double limit = limitNum != null ? limitNum.doubleValue() : 0.0;

        var existing = budgetRepository.findAll().stream()
                .filter(b -> b.getCategory().equalsIgnoreCase(category))
                .findFirst();

        Budget budget;
        if (existing.isPresent()) {
            budget = existing.get();
            budget.setAmountLimit(limit);
        } else {
            budget = new Budget(category, limit, null);
        }

        budgetRepository.save(budget);
        return ResponseEntity.ok(Map.of("category", category, "limit", limit, "status", "saved"));
    }
}

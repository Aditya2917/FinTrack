package com.financetracker.controller;

import com.financetracker.dto.StatsSummaryDto;
import com.financetracker.dto.TransactionDto;
import com.financetracker.entity.Transaction;
import com.financetracker.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionRepository transactionRepository;

    @GetMapping
    public ResponseEntity<List<TransactionDto>> getAllTransactions() {
        List<Transaction> list = transactionRepository.findAllByOrderByDateDesc();
        List<TransactionDto> dtos = list.stream().map(this::mapToDto).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<TransactionDto> createTransaction(@RequestBody TransactionDto dto) {
        Transaction tx = new Transaction();
        tx.setTitle(dto.getTitle());
        tx.setAmount(dto.getAmount());
        tx.setType(dto.getType());
        tx.setCategory(dto.getCategory());
        tx.setPaymentMethod(dto.getPaymentMethod());
        tx.setDate(dto.getDate() != null ? dto.getDate() : LocalDate.now());
        tx.setNotes(dto.getNotes());
        tx.setRecurring(dto.getRecurring() != null ? dto.getRecurring() : "none");

        Transaction saved = transactionRepository.save(tx);
        return ResponseEntity.ok(mapToDto(saved));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTransactionById(@PathVariable Long id) {
        return transactionRepository.findById(id)
                .map(tx -> ResponseEntity.ok(mapToDto(tx)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTransaction(@PathVariable Long id, @RequestBody TransactionDto dto) {
        return transactionRepository.findById(id)
                .map(tx -> {
                    tx.setTitle(dto.getTitle());
                    tx.setAmount(dto.getAmount());
                    tx.setType(dto.getType());
                    tx.setCategory(dto.getCategory());
                    tx.setPaymentMethod(dto.getPaymentMethod());
                    if (dto.getDate() != null) tx.setDate(dto.getDate());
                    tx.setNotes(dto.getNotes());
                    if (dto.getRecurring() != null) tx.setRecurring(dto.getRecurring());
                    Transaction updated = transactionRepository.save(tx);
                    return ResponseEntity.ok(mapToDto(updated));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTransaction(@PathVariable Long id) {
        return transactionRepository.findById(id)
                .map(tx -> {
                    transactionRepository.delete(tx);
                    return ResponseEntity.ok(Map.of("message", "Transaction deleted successfully"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/stats")
    public ResponseEntity<StatsSummaryDto> getStats() {
        List<Transaction> list = transactionRepository.findAll();
        double totalIncome = list.stream().filter(t -> "income".equalsIgnoreCase(t.getType())).mapToDouble(Transaction::getAmount).sum();
        double totalExpenses = list.stream().filter(t -> "expense".equalsIgnoreCase(t.getType())).mapToDouble(Transaction::getAmount).sum();
        double netBalance = totalIncome - totalExpenses;
        int savingsRate = totalIncome > 0 ? (int) Math.max(0, Math.round((netBalance / totalIncome) * 100)) : 0;

        return ResponseEntity.ok(new StatsSummaryDto(totalIncome, totalExpenses, netBalance, savingsRate, (long) list.size()));
    }

    private TransactionDto mapToDto(Transaction tx) {
        TransactionDto dto = new TransactionDto();
        dto.setId(tx.getId());
        dto.setTitle(tx.getTitle());
        dto.setAmount(tx.getAmount());
        dto.setType(tx.getType());
        dto.setCategory(tx.getCategory());
        dto.setPaymentMethod(tx.getPaymentMethod());
        dto.setDate(tx.getDate());
        dto.setNotes(tx.getNotes());
        dto.setRecurring(tx.getRecurring());
        return dto;
    }
}

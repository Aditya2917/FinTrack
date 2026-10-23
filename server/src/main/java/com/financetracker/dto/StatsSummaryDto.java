package com.financetracker.dto;

public class StatsSummaryDto {
    private Double totalIncome;
    private Double totalExpenses;
    private Double netBalance;
    private Integer savingsRate;
    private Long transactionCount;

    public StatsSummaryDto(Double totalIncome, Double totalExpenses, Double netBalance, Integer savingsRate, Long transactionCount) {
        this.totalIncome = totalIncome;
        this.totalExpenses = totalExpenses;
        this.netBalance = netBalance;
        this.savingsRate = savingsRate;
        this.transactionCount = transactionCount;
    }

    public Double getTotalIncome() { return totalIncome; }
    public Double getTotalExpenses() { return totalExpenses; }
    public Double getNetBalance() { return netBalance; }
    public Integer getSavingsRate() { return savingsRate; }
    public Long getTransactionCount() { return transactionCount; }
}

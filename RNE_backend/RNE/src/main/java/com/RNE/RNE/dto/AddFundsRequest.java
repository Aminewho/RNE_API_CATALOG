package com.RNE.RNE.dto;

import java.math.BigDecimal;

public class AddFundsRequest {
    private BigDecimal amount;

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}

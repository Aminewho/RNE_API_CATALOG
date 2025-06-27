package com.RNE.RNE.repository;
import com.RNE.RNE.model.Transaction;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByWalletId(Long walletId);

    
}

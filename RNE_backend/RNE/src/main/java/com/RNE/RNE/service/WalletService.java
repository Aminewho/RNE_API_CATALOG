package com.RNE.RNE.service;

import com.RNE.RNE.model.Transaction;
import com.RNE.RNE.model.User;
import com.RNE.RNE.model.Wallet;
import com.RNE.RNE.repository.TransactionRepository;
import com.RNE.RNE.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class WalletService {

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private TransactionRepository transactionRepository;

  

    public Wallet getWalletByUser(User user) {
        return walletRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Wallet not found for user: " + user.getUsername()));
    }

   

    public void addFunds(User user, BigDecimal amount) {
        Wallet wallet = getWalletByUser(user);
        wallet.setBalance(wallet.getBalance().add(amount));
        walletRepository.save(wallet);
        recordTransaction(wallet, amount, "augmentation de solde");
    }

    public void deductFunds(User user, BigDecimal amount, String description) {
        Wallet wallet = getWalletByUser(user);
        if (wallet.getBalance().compareTo(amount) < 0) {
            throw new IllegalArgumentException("Insufficient balance");
        }
        wallet.setBalance(wallet.getBalance().subtract(amount));
        walletRepository.save(wallet);
        recordTransaction(wallet, amount.negate(), description);
    }

    private void recordTransaction(Wallet wallet, BigDecimal amount, String description) {
        Transaction tx = new Transaction();
        tx.setWallet(wallet);
        tx.setAmount(amount);
        tx.setDescription(description);
        tx.setTimestamp(java.time.LocalDateTime.now());
        transactionRepository.save(tx);
    }

    public List<Transaction> getTransactions(User user) {
        Wallet wallet = getWalletByUser(user);
        return transactionRepository.findByWalletId(wallet.getId());
    }
}

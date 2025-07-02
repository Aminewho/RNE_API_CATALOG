package com.RNE.RNE.controller;

import com.RNE.RNE.model.Transaction;
import com.RNE.RNE.model.User;
import com.RNE.RNE.model.Wallet;
import com.RNE.RNE.repository.UserRepository;
import com.RNE.RNE.service.UserService;
import com.RNE.RNE.service.WalletService;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/wallet")
public class WalletController {

    @Autowired
    private WalletService walletService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getWallet(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        Wallet wallet = walletService.getWalletByUser(user);
        return ResponseEntity.ok(wallet);
    }
    @GetMapping("/transactions")
    public ResponseEntity<?> getTransactions(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        List<Transaction> transactions = walletService.getTransactions(user);
        if (transactions.isEmpty()) {
            return ResponseEntity.status(404).body("No transactions found for user");
        }
        return ResponseEntity.ok(transactions);
    }
}

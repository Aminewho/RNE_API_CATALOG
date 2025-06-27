package com.RNE.RNE.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.RNE.RNE.model.Wallet;
public interface WalletRepository extends JpaRepository<Wallet, Long> {
    Optional<Wallet> findByUserId(Long UserId);
}
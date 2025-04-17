package com.RNE.RNE.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.RNE.RNE.model.User;
public interface UserRepository extends JpaRepository<User, Long> {
}

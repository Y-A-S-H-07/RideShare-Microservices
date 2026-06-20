package com.rideshare.userservice.repository;

import com.rideshare.userservice.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByFromUserIdOrToUserIdOrderByIdDesc(Long fromUserId, Long toUserId);
}
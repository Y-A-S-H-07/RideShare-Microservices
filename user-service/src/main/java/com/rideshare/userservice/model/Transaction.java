package com.rideshare.userservice.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double amount;

    @Enumerated(EnumType.STRING)
    private com.rideshare.userservice.model.TransactionType type;

    private String status;

    // automatically set timestamp
    @CreationTimestamp
    private LocalDateTime createdAt;

    // who paid
    @ManyToOne
    @JoinColumn(name = "from_user_id")
    @JsonIgnoreProperties({"password", "role"})
    private com.rideshare.userservice.model.User fromUser;

    //who received
    @ManyToOne
    @JoinColumn(name = "to_user_id")
    @JsonIgnoreProperties({"password", "role"})
    private com.rideshare.userservice.model.User toUser;

    private Long rideId;
}
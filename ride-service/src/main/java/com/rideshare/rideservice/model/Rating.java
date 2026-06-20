package com.rideshare.rideservice.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ratings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int score;

    private String comment;

    @ManyToOne
    @JoinColumn(name = "ride_id")
    private Ride ride;

    // User-service user IDs
    private Long fromUserId;

    private Long toUserId;
}
package com.rideshare.rideservice.model;

import jakarta.persistence.*;
import lombok.*;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "ride_participants")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RideParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "ride_id")
    @JsonIgnoreProperties({"participants"})
    private Ride ride;

    // User ID from user-service
    private Long userId;

    @Enumerated(EnumType.STRING)
    private RequestStatus status;
}
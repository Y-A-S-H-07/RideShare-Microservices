package com.rideshare.rideservice.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "drivers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String vehicleName;

    private String vehicleNumber;

    private int maxSeats;

    // User ID from user-service
    private Long userId;
}
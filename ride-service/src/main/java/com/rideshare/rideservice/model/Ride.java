package com.rideshare.rideservice.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "rides")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ride {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String source;

    private String destination;

    private double distance;

    private double totalFare;

    private String vehicleType;

    private int hostSeats;

    private int totalSeats;

    private int availableSeats;

    private LocalDateTime rideTime;

    // store user-service user id only
    private Long hostId;

    @Enumerated(EnumType.STRING)
    private RideStatus status;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    @JsonIgnoreProperties({"user"})
    private Driver driver;

    @OneToMany(
            mappedBy = "ride",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY
    )
    @JsonIgnoreProperties({"ride"})
    private List<RideParticipant> participants;
}
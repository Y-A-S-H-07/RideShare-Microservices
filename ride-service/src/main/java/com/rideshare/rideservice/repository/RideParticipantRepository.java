package com.rideshare.rideservice.repository;

import com.rideshare.rideservice.model.RideParticipant;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RideParticipantRepository
        extends JpaRepository<RideParticipant, Long> {

    boolean existsByRideIdAndUserId(
            Long rideId,
            Long userId
    );

    List<RideParticipant> findByRideId(Long rideId);
}
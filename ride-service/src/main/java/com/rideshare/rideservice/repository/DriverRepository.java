package com.rideshare.rideservice.repository;

import java.util.Optional;

import com.rideshare.rideservice.model.Driver;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DriverRepository extends JpaRepository<Driver, Long> {

    Optional<Driver> findByUserId(Long userId);

    boolean existsByUserIdAndIdNotNull(Long userId);
}
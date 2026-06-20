package com.rideshare.rideservice.repository;

import com.rideshare.rideservice.model.Ride;

import com.rideshare.rideservice.model.RideStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RideRepository extends JpaRepository<Ride, Long> {

    List<Ride> findByAvailableSeatsGreaterThanAndStatus(
            int seats,
            RideStatus status
    );

    List<Ride> findBySourceIgnoreCaseAndDestinationIgnoreCaseAndStatus(
            String source,
            String destination,
            RideStatus status
    );

    boolean existsByDriverIdAndStatusIn(
            Long driverId,
            List<RideStatus> statuses
    );

    boolean existsByHostIdAndStatusIn(
            Long hostId,
            List<RideStatus> statuses
    );

    @Query("""
            SELECT r
            FROM Ride r
            WHERE LOWER(r.source) LIKE LOWER(CONCAT('%', :source, '%'))
            AND LOWER(r.destination) LIKE LOWER(CONCAT('%', :destination, '%'))
            AND r.status = :status
            """)
    List<Ride> searchFlexible(
            @Param("source") String source,
            @Param("destination") String destination,
            @Param("status") RideStatus status
    );
}
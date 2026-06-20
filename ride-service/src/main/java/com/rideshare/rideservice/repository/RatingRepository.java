package com.rideshare.rideservice.repository;

import com.rideshare.rideservice.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    @Query("SELECT AVG(r.score) FROM Rating r WHERE r.toUserId = :userId")
    Double getAverageRatingByUserId(@Param("userId") Long userId);
}
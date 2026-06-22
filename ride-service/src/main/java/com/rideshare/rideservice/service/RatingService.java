package com.rideshare.rideservice.service;

import com.rideshare.rideservice.dto.RatingRequest;
import com.rideshare.rideservice.model.Rating;
import com.rideshare.rideservice.model.Ride;
import com.rideshare.rideservice.repository.RatingRepository;
import com.rideshare.rideservice.repository.RideRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RatingService {

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private RideRepository rideRepository;

    public Rating addRating(RatingRequest request) {

        Ride ride = rideRepository.findById(request.getRideId())
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        Rating rating = new Rating();

        rating.setRide(ride);
        rating.setFromUserId(request.getFromUserId());
        rating.setToUserId(request.getToUserId());
        rating.setScore(request.getScore());
        rating.setComment(request.getComment());

        return ratingRepository.save(rating);
    }

    public Double getAverageRating(Long userId) {

        Double avg = ratingRepository.getAverageRatingByUserId(userId);

        return avg == null ? 0.0 : avg;
    }
}
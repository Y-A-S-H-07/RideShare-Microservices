package com.rideshare.rideservice.controller;

import com.rideshare.rideservice.dto.RatingRequest;
import com.rideshare.rideservice.model.Rating;
import com.rideshare.rideservice.service.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/ratings")
public class RatingController {

    @Autowired
    private RatingService ratingService;

    @PostMapping("/add")
    public Rating addRating(@RequestBody RatingRequest request) {
        return ratingService.addRating(request);
    }

    @GetMapping("/user/{userId}")
    public Map<String, Double> getRating(@PathVariable Long userId) {

        return Map.of(
                "averageRating",
                ratingService.getAverageRating(userId)
        );
    }
}
package com.rideshare.rideservice.dto;

import lombok.Data;

@Data
public class RatingRequest {

    private Long rideId;
    private Long fromUserId;
    private Long toUserId;
    private int score;
    private String comment;
}
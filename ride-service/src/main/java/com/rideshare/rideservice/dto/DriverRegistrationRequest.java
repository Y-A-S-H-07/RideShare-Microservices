package com.rideshare.rideservice.dto;

import lombok.Data;

@Data
public class DriverRegistrationRequest {

    private Long userId;

    private String vehicleName;

    private String vehicleNumber;

    private int maxSeats;
}
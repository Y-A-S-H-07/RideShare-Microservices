package com.rideshare.userservice.dto;

import lombok.Data;

@Data
public class DriverRegisterRequest {

    private String name;
    private String email;
    private String password;

    private String vehicleName;
    private String vehicleNumber;
    private int maxSeats;
}
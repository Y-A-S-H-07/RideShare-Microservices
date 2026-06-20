package com.rideshare.rideservice.controller;



import com.rideshare.rideservice.dto.DriverRegistrationRequest;
import com.rideshare.rideservice.model.Driver;
import com.rideshare.rideservice.service.DriverService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/drivers")
public class DriverController {

    @Autowired
    private DriverService driverService;

    @PostMapping("/register")
    public Driver registerDriver(@RequestBody DriverRegistrationRequest request) {
        return driverService.registerDriver(request);
    }

    @GetMapping("/by-user")
    public Driver getDriverByUser(@RequestParam Long userId) {
        return driverService.getDriverByUserId(userId);
    }
}
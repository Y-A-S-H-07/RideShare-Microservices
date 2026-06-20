package com.rideshare.rideservice.service;

import com.rideshare.rideservice.dto.DriverRegistrationRequest;
import com.rideshare.rideservice.model.Driver;
import com.rideshare.rideservice.repository.DriverRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DriverService {

    @Autowired
    private DriverRepository driverRepository;

    public Driver registerDriver(DriverRegistrationRequest request) {

        Driver driver = new Driver();

        driver.setVehicleName(request.getVehicleName());
        driver.setVehicleNumber(request.getVehicleNumber());
        driver.setMaxSeats(request.getMaxSeats());

        // store user-service user id
        driver.setUserId(request.getUserId());

        return driverRepository.save(driver);
    }

    public Driver getDriverByUserId(Long userId) {

        return driverRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
    }
}
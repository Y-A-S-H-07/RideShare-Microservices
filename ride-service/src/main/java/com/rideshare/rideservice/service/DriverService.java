package com.rideshare.rideservice.service;

import com.rideshare.rideservice.dto.DriverRegistrationRequest;
import com.rideshare.rideservice.dto.UserDTO;
import com.rideshare.rideservice.model.Driver;
import com.rideshare.rideservice.repository.DriverRepository;
import com.rideshare.rideservice.client.UserClient;
import com.rideshare.rideservice.dto.UserDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DriverService {

    @Autowired
    private DriverRepository driverRepository;



    @Autowired
    private UserClient userClient;


    public Driver registerDriver(DriverRegistrationRequest request) {

        Driver driver = new Driver();

        driver.setVehicleName(request.getVehicleName());
        driver.setVehicleNumber(request.getVehicleNumber());
        driver.setMaxSeats(request.getMaxSeats());

        UserDTO user = userClient.getUserById(request.getUserId());

        if (user == null) {
            throw new RuntimeException("User not found");
        }



        // store user-service user id
        driver.setUserId(request.getUserId());

        return driverRepository.save(driver);
    }

    public Driver getDriverByUserId(Long userId) {

        return driverRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
    }
}
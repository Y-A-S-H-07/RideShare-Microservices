package com.rideshare.userservice.client;

import com.rideshare.userservice.dto.DriverRegistrationRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "RIDE-SERVICE")
public interface RideServiceClient {

    @PostMapping("/drivers/register")
    Object registerDriver(
            @RequestBody DriverRegistrationRequest request
    );
}
package com.rideshare.rideservice.controller;

import java.util.List;

import com.rideshare.rideservice.model.Ride;
import com.rideshare.rideservice.service.AIService;
import com.rideshare.rideservice.service.RideService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/rides")
public class RideController {

    @Autowired
    private RideService rideService;

    @Autowired
    private AIService aiService;

    @GetMapping("/estimate")
    public double estimateFare(
            @RequestParam String source,
            @RequestParam String destination,
            @RequestParam String vehicleType
    ) {
        return rideService.calculateEstimatedFare(source, destination, vehicleType);
    }

    @GetMapping("/search")
    public List<Ride> searchRides(
            @RequestParam String source,
            @RequestParam String destination
    ) {
        return rideService.searchRides(source, destination);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createRide(@RequestBody Ride ride) {
        try {
            Ride createdRide = rideService.createRide(ride);
            return ResponseEntity.ok(createdRide);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/join")
    public String joinRide(
            @RequestParam Long rideId,
            @RequestParam Long userId
    ) {
        return rideService.joinRide(rideId, userId);
    }

    @GetMapping("/all")
    public List<Ride> getAllRides() {
        return rideService.getAllRides();
    }

    @GetMapping("/available")
    public List<Ride> getAvailableRides() {
        return rideService.getAvailableRides();
    }

    @PostMapping("/accept")
    public Ride acceptRide(
            @RequestParam Long rideId,
            @RequestParam Long driverId
    ) {
        return rideService.acceptRide(rideId, driverId);
    }

    @PostMapping("/start")
    public Ride startRide(@RequestParam Long rideId) {
        return rideService.startRide(rideId);
    }

    @PostMapping("/complete")
    public Ride completeRide(@RequestParam Long rideId) {
        return rideService.completeRide(rideId);
    }

    @PostMapping("/cancel")
    public Ride cancelRide(
            @RequestParam Long rideId,
            @RequestParam Long userId
    ) {
        return rideService.cancelRide(rideId, userId);
    }

    @PostMapping("/leave")
    public String leaveRide(
            @RequestParam Long rideId,
            @RequestParam Long userId
    ) {
        return rideService.leaveRide(rideId, userId);
    }

    @PostMapping("/accept-request")
    public String acceptRequest(
            @RequestParam Long rideId,
            @RequestParam Long userId,
            @RequestParam Long hostId
    ) {
        return rideService.acceptRequest(rideId, userId, hostId);
    }

    @PostMapping("/reject-request")
    public String rejectRequest(
            @RequestParam Long rideId,
            @RequestParam Long userId,
            @RequestParam Long hostId
    ) {
        return rideService.rejectRequest(rideId, userId, hostId);
    }

    @GetMapping("/smart-search")
    public List<Ride> smartSearch(
            @RequestParam String source,
            @RequestParam String destination
    ) {
        return rideService.smartSearch(source, destination);
    }

    @GetMapping("/ai-suggest")
    public String aiSuggest(
            @RequestParam String source,
            @RequestParam String destination
    ) {
        List<Ride> rides = rideService.smartSearch(source, destination);
        return aiService.suggestRide(source, destination, rides);
    }

    @PostMapping("/arrived")
    public Ride arrivedRide(@RequestParam Long rideId) {
        return rideService.arrivedRide(rideId);
    }
}
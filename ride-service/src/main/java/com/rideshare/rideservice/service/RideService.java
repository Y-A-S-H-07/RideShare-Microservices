package com.rideshare.rideservice.service;

import java.util.List;

import com.rideshare.rideservice.model.*;

import com.rideshare.rideservice.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import java.util.Map;

@Service
public class RideService {


    @Autowired
    private RideRepository rideRepository;


    @Autowired
    private RideParticipantRepository participantRepository;

    @Autowired
    private DriverRepository driverRepository;





    private final RestTemplate restTemplate = new RestTemplate();


    public List<Ride> searchRides(String source, String destination) {

        source = source.split(",")[0].trim();
        destination = destination.split(",")[0].trim();

        System.out.println("Searching: " + source + " → " + destination);

        return rideRepository.searchFlexible(
                source,
                destination,
                RideStatus.CREATED
        );
    }
    public Ride createRide(Ride ride) {

        int totalSeats = getSeatsFromVehicleType(ride.getVehicleType());
        ride.setTotalSeats(totalSeats);

        if (ride.getHostSeats() <= 0) {
            throw new RuntimeException("Host seats must be at least 1");
        }

        if (ride.getHostSeats() > totalSeats) {
            throw new RuntimeException("Host seats cannot exceed total seats");
        }

        if (ride.getHostId() == null) {
            throw new RuntimeException("Host ID is required");
        }

        boolean hasActiveRide = rideRepository.existsByHostIdAndStatusIn(
                ride.getHostId(),
                java.util.Arrays.asList(
                        RideStatus.CREATED,
                        RideStatus.ACCEPTED,
                        RideStatus.STARTED
                )
        );

        if (hasActiveRide) {
            throw new RuntimeException("You already have an active ride");
        }

        ride.setAvailableSeats(totalSeats - ride.getHostSeats());

        double distance = getDistanceFromAPI(ride.getSource(), ride.getDestination());
        ride.setDistance(distance);

        double totalFare = distance * 10;
        ride.setTotalFare(totalFare);

        ride.setStatus(RideStatus.CREATED);

        return rideRepository.save(ride);
    }

    private int getSeatsFromVehicleType(String vehicleType) {
        if (vehicleType == null) return 4;

        vehicleType = vehicleType.trim().toUpperCase();

        switch (vehicleType) {
            case "3_SEATER": return 3;
            case "4_SEATER": return 4;
            case "5_SEATER": return 5;
            case "7_SEATER": return 7;
            default: return 4;
        }
    }

    public String joinRide(Long rideId, Long userId) {

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        if (ride.getStatus() != RideStatus.CREATED) {
            return "Cannot request. Ride already accepted or started";
        }

        if (participantRepository.existsByRideIdAndUserId(rideId, userId)) {
            return "Already requested this ride";
        }

        if (ride.getAvailableSeats() <= 0) {
            return "No seats available";
        }

        RideParticipant participant = new RideParticipant();
        participant.setRide(ride);
        participant.setUserId(userId);
        participant.setStatus(RequestStatus.PENDING);

        participantRepository.save(participant);

        return "Request sent. Waiting for host approval.";
    }

    public List<Ride> getAllRides() {
        return rideRepository.findAll();
    }

    public List<Ride> getAvailableRides() {
        return rideRepository.findByAvailableSeatsGreaterThanAndStatus(0, RideStatus.CREATED);
    }

    public Ride acceptRide(Long rideId, Long driverId) {

        boolean hasActiveRide = rideRepository.existsByDriverIdAndStatusIn(
                driverId,
                java.util.Arrays.asList(
                        RideStatus.ACCEPTED,
                        RideStatus.STARTED
                )
        );

        if (hasActiveRide) {
            throw new RuntimeException("Driver already has an active ride");
        }

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        ride.setDriver(driver);
        ride.setStatus(RideStatus.ACCEPTED);

        return rideRepository.save(ride);
    }
    public Ride startRide(Long rideId) {

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        if (ride.getStatus() != RideStatus.ARRIVED) {
            throw new RuntimeException("Ride must be ARRIVED first");
        }

        ride.setStatus(RideStatus.STARTED);

        return rideRepository.save(ride);
    }
    public Ride completeRide(Long rideId) {

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        if (ride.getStatus() != RideStatus.STARTED) {
            throw new RuntimeException("Ride must be STARTED first");
        }

        ride.setStatus(RideStatus.COMPLETED);

        return rideRepository.save(ride);
    }


    public Ride cancelRide(Long rideId, Long userId) {

        Ride ride = rideRepository.findById(rideId).orElseThrow();

        // only host can cancel
        // only host can cancel
        if (!ride.getHostId().equals(userId)) {
            throw new RuntimeException("Only host can cancel the ride");
        }

        // cannot cancel after start
        if (ride.getStatus() == RideStatus.STARTED || ride.getStatus() == RideStatus.COMPLETED) {
            throw new RuntimeException("Cannot cancel ride after it has started");
        }

        ride.setStatus(RideStatus.CANCELLED);

        return rideRepository.save(ride);
    }



    public String leaveRide(Long rideId, Long userId) {

        Ride ride = rideRepository.findById(rideId).orElseThrow();

        if (ride.getStatus() != RideStatus.CREATED &&
                ride.getStatus() != RideStatus.ACCEPTED) {
            return "Cannot leave ride after it has started";
        }

        RideParticipant participant = participantRepository
                .findByRideId(rideId)
                .stream()
                .filter(p -> p.getUserId().equals(userId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("User not part of this ride"));

        participantRepository.delete(participant);

        ride.setAvailableSeats(ride.getAvailableSeats() + 1);
        rideRepository.save(ride);

        return "Left ride successfully";
    }


    public String acceptRequest(Long rideId, Long userId, Long hostId) {

        Ride ride = rideRepository.findById(rideId).orElseThrow();

        if (!ride.getHostId().equals(hostId)) {
            return "Only host can accept requests";
        }

        if (ride.getAvailableSeats() <= 0) {
            return "No seats available";
        }

        RideParticipant participant = participantRepository
                .findByRideId(rideId)
                .stream()
                .filter(p -> p.getUserId().equals(userId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (participant.getStatus() != RequestStatus.PENDING) {
            return "Request already processed";
        }

        participant.setStatus(RequestStatus.ACCEPTED);
        participantRepository.save(participant);

        ride.setAvailableSeats(ride.getAvailableSeats() - 1);
        rideRepository.save(ride);

        return "Request accepted";
    }

    public String rejectRequest(Long rideId, Long userId, Long hostId) {

        Ride ride = rideRepository.findById(rideId).orElseThrow();

        if (!ride.getHostId().equals(hostId)) {
            return "Only host can reject requests";
        }

        RideParticipant participant = participantRepository
                .findByRideId(rideId)
                .stream()
                .filter(p -> p.getUserId().equals(userId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Request not found"));

        participant.setStatus(RequestStatus.REJECTED);
        participantRepository.save(participant);

        return "Request rejected";
    }


    private double getDistanceFromAPI(String source, String destination) {

        try {
            // simple city → coords mapping (for demo)
            String src = getCoordinates(source);
            String dest = getCoordinates(destination);

            String url = "https://router.project-osrm.org/route/v1/driving/"
                    + src + ";" + dest + "?overview=false";

            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);

            Map body = response.getBody();

            if (body == null || !body.containsKey("routes")) {
                throw new RuntimeException("Invalid response from map API");
            }

            var routes = (java.util.List<Map>) body.get("routes");
            var route = routes.get(0);

            Number distanceValue = (Number) route.get("distance");
            double distanceMeters = distanceValue.doubleValue();

            return distanceMeters / 1000.0; // convert to KM

        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch distance: " + e.getMessage());
        }
    }


    private String getCoordinates(String city) {

        try {

            city = city.split(",")[0].trim();
            String url = "https://nominatim.openstreetmap.org/search?q="
                    + city + "&format=json&limit=1";

            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.set("User-Agent", "ride-sharing-app");

            org.springframework.http.HttpEntity<String> entity =
                    new org.springframework.http.HttpEntity<>(headers);

            ResponseEntity<java.util.List> response =
                    restTemplate.exchange(url,
                            org.springframework.http.HttpMethod.GET,
                            entity,
                            java.util.List.class);

            var list = response.getBody();

            if (list == null || list.isEmpty()) {
                throw new RuntimeException("City not found: " + city);
            }

            Map data = (Map) list.get(0);

            String lat = (String) data.get("lat");
            String lon = (String) data.get("lon");

            return lon + "," + lat;

        } catch (Exception e) {
            throw new RuntimeException("Failed to get coordinates: " + e.getMessage());
        }
    }


    public List<Ride> smartSearch(String source, String destination) {

        List<Ride> allRides = rideRepository.findAll();

        return allRides.stream()
                .filter(r -> r.getStatus() == RideStatus.CREATED)
                .filter(r -> r.getAvailableSeats() > 0)
                .filter(r -> r.getDestination().equalsIgnoreCase(destination))
                .sorted((r1, r2) -> {
                    int score1 = calculateScore(r1, source);
                    int score2 = calculateScore(r2, source);
                    return Integer.compare(score2, score1); // higher first
                })
                .toList();
    }



    private int calculateScore(Ride ride, String userSource) {

        int score = 0;

        // exact source match
        if (ride.getSource().equalsIgnoreCase(userSource)) {
            score += 50;
        }

        // partial match (simple AI trick)
        else if (ride.getSource().toLowerCase().contains(userSource.toLowerCase())
                || userSource.toLowerCase().contains(ride.getSource().toLowerCase())) {
            score += 30;
        }

        // more available seats = better
        score += ride.getAvailableSeats() * 5;

        // shorter distance
        if (ride.getDistance() < 100) {
            score += 10;
        }

        return score;
    }


    public double calculateEstimatedFare(String source, String destination, String vehicleType) {

        double distance;

        try {
            distance = getDistanceFromAPI(source, destination);
        } catch (Exception e) {
            distance = 10; // fallback
        }

        double baseRate = 10;

        double multiplier;

        switch (vehicleType) {
            case "3_SEATER": multiplier = 1; break;
            case "4_SEATER": multiplier = 1.2; break;
            case "5_SEATER": multiplier = 1.5; break;
            case "7_SEATER": multiplier = 2; break;
            default: multiplier = 1;
        }

        return distance * baseRate * multiplier;
    }


    public Ride arrivedRide(Long rideId) {

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        // check status
        if (ride.getStatus() != RideStatus.ACCEPTED) {
            throw new RuntimeException("Ride must be ACCEPTED first");
        }

        // update status
        ride.setStatus(RideStatus.ARRIVED);

        // notify ALL participants

        // notify host separately

        return rideRepository.save(ride);
    }


}
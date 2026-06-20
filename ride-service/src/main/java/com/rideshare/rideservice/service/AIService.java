package com.rideshare.rideservice.service;

import com.rideshare.rideservice.model.Ride;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AIService {

    @Value("${groq.api.key:}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String suggestRide(String source,
                              String destination,
                              List<Ride> rides) {

        if (rides.isEmpty()) {
            return "No rides available";
        }

        try {

            String prompt =
                    "User wants to travel from " + source +
                            " to " + destination +
                            ". Available rides: " + rides +
                            ". Suggest the best ride in one short sentence.";

            Map<String, Object> body = new HashMap<>();

            body.put("model", "llama-3.3-70b-versatile");

            List<Map<String, String>> messages = List.of(
                    Map.of(
                            "role", "user",
                            "content", prompt
                    )
            );

            body.put("messages", messages);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            HttpEntity<Map<String, Object>> entity =
                    new HttpEntity<>(body, headers);

            ResponseEntity<Map> response =
                    restTemplate.exchange(
                            "https://api.groq.com/openai/v1/chat/completions",
                            HttpMethod.POST,
                            entity,
                            Map.class
                    );

            List choices =
                    (List) response.getBody().get("choices");

            Map choice = (Map) choices.get(0);

            Map message =
                    (Map) choice.get("message");

            return (String) message.get("content");

        } catch (Exception e) {

            Ride bestRide = rides.get(0);

            return "Best ride is Ride ID "
                    + bestRide.getId()
                    + " from "
                    + bestRide.getSource()
                    + " to "
                    + bestRide.getDestination();
        }
    }
}
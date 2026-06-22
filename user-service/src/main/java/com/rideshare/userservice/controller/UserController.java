package com.rideshare.userservice.controller;

import com.rideshare.userservice.dto.DriverRegisterRequest;
import com.rideshare.userservice.model.User;
import com.rideshare.userservice.model.Wallet;
import com.rideshare.userservice.model.Notification;
import com.rideshare.userservice.repository.NotificationRepository;
import com.rideshare.userservice.repository.TransactionRepository;
import com.rideshare.userservice.service.UserService;
import com.rideshare.userservice.model.Transaction;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.rideshare.userservice.dto.AuthResponse;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private NotificationRepository notificationRepository;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.registerUser(user);
    }

    @GetMapping("/notifications")
    public List<Notification> getNotifications(@RequestParam Long userId) {
        return notificationRepository.findByUserId(userId);
    }


    @PostMapping("/login")
    public AuthResponse login(@RequestBody User user) {

        User loggedInUser =
                userService.login(user.getEmail(), user.getPassword());

        String token =
                userService.generateToken(loggedInUser);

        return new AuthResponse(
                token,
                loggedInUser.getId(),
                loggedInUser.getName(),
                loggedInUser.getRole().name()
        );
    }

    @GetMapping("/wallet")
    public Wallet getWallet(@RequestParam Long userId) {
        return userService.getWallet(userId);
    }


    @Autowired
    private TransactionRepository transactionRepository;

    @GetMapping("/transactions")
    public List<Transaction> getUserTransactions(@RequestParam Long userId) {
        return transactionRepository
                .findByFromUserIdOrToUserIdOrderByIdDesc(userId, userId);
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PostMapping("/register-driver")
    public User registerDriver(
            @RequestBody DriverRegisterRequest request) {

        return userService.registerDriver(request);
    }



    
}
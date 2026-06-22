package com.rideshare.userservice.service;


import com.rideshare.userservice.model.User;
import com.rideshare.userservice.model.Wallet;
import com.rideshare.userservice.model.Role;
import com.rideshare.userservice.repository.UserRepository;
import com.rideshare.userservice.repository.WalletRepository;

import com.rideshare.userservice.security.JwtUtil;
import com.rideshare.userservice.dto.DriverRegisterRequest;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private JwtUtil jwtUtil;



   public User registerUser(User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        user.setRole(Role.DRIVER);

        User savedUser = userRepository.save(user);

        // create wallete


        Wallet wallet = new Wallet();
        wallet.setUser(savedUser);
        wallet.setBalance(0.0);

        walletRepository.save(wallet);

        return savedUser;
    }


    public User registerDriver(DriverRegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(Role.DRIVER);

        User savedUser = userRepository.save(user);

        Wallet wallet = new Wallet();
        wallet.setUser(savedUser);
        wallet.setBalance(0.0);

        walletRepository.save(wallet);

        return savedUser;
    }




    public User login(String email, String password) {

        System.out.println("LOGIN EMAIL: " + email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        System.out.println("DB USER EMAIL: " + user.getEmail());

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }

    public Wallet getWallet(Long userId) {
        return walletRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));
    }

    public User getUserById(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public String generateToken(User user) {
        return jwtUtil.generateToken(user.getEmail());
    }
}
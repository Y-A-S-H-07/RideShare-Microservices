package com.rideshare.userservice.service;


import com.rideshare.userservice.model.User;
import com.rideshare.userservice.model.Wallet;
import com.rideshare.userservice.model.Role;
import com.rideshare.userservice.repository.UserRepository;
import com.rideshare.userservice.repository.WalletRepository;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WalletRepository walletRepository;

   public User registerUser(User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        user.setRole(Role.USER);

        User savedUser = userRepository.save(user);

        // create wallete


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
}
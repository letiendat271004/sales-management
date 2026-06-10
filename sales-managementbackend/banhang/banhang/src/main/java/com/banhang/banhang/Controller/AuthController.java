package com.banhang.banhang.Controller;

import com.banhang.banhang.Repository.UserRepository;
import com.banhang.banhang.dto.*;
import com.banhang.banhang.entity.User;
import com.banhang.banhang.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return "Username đã tồn tại";
        }

        User user = new User();

        user.setUsername(request.getUsername());
        user.setPassword(
                encoder.encode(request.getPassword())
        );
        user.setRole("USER");

        userRepository.save(user);

        return "Register Success";
    }

    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody LoginRequest request
    ){

        User user = userRepository
                .findByUsername(request.getUsername())
                .orElseThrow();

        if(!encoder.matches(
                request.getPassword(),
                user.getPassword()
        )){
            throw new RuntimeException("Sai mật khẩu");
        }

        String token =
                jwtUtil.generateToken(
                        user.getUsername(),
                        user.getRole()
                );

        return new LoginResponse(
                token,
                user.getUsername(),
                user.getRole()
        );
    }
}
package com.contactchatmanager.controller;

import com.contactchatmanager.dto.LoginRequest;
import com.contactchatmanager.dto.RegisterRequest;
import com.contactchatmanager.model.User;
import com.contactchatmanager.repository.UserRepository;
import com.contactchatmanager.security.JwtService;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;

  public AuthController(
      UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
  }

  @PostMapping("/register")
  public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody RegisterRequest request) {
    if (userRepository.findByEmail(request.getEmail()).isPresent()) {
      return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Email already registered"));
    }
    if (userRepository.findByPhone(request.getPhone()).isPresent()) {
      return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Mobile number already registered"));
    }

    User user = new User();
    user.setName(request.getName());
    user.setEmail(request.getEmail());
    user.setPhone(request.getPhone());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setStatus("ACTIVE");
    user.setRole("USER");

    User saved = userRepository.save(user);
    UserDetails userDetails =
        org.springframework.security.core.userdetails.User.builder()
            .username(saved.getEmail())
            .password(saved.getPassword())
            .roles(saved.getRole())
            .build();
    String token = jwtService.generateToken(userDetails, saved.getPhone(), saved.getRole());

    Map<String, Object> response = new HashMap<>();
    response.put("message", "User registered");
    response.put("token", token);
    response.put("userId", saved.getPhone());
    response.put("name", saved.getName());
    response.put("email", saved.getEmail());
    response.put("phone", saved.getPhone());
    response.put("role", saved.getRole());
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @PostMapping("/login")
  public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) {
    User user = userRepository.findByEmail(request.getEmail()).orElse(null);
    if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
    }

    String role = user.getRole() == null ? "USER" : user.getRole();
    UserDetails userDetails =
        org.springframework.security.core.userdetails.User.builder()
            .username(user.getEmail())
            .password(user.getPassword())
            .roles(role)
            .build();
    String token = jwtService.generateToken(userDetails, user.getPhone(), role);

    Map<String, Object> response = new HashMap<>();
    response.put("message", "Login success");
    response.put("token", token);
    response.put("userId", user.getPhone());
    response.put("name", user.getName());
    response.put("email", user.getEmail());
    response.put("phone", user.getPhone());
    response.put("role", role);
    return ResponseEntity.ok(response);
  }
}

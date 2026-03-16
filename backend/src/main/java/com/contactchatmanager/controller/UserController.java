package com.contactchatmanager.controller;

import com.contactchatmanager.model.User;
import com.contactchatmanager.repository.UserRepository;
import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {
  private final UserRepository userRepository;

  public UserController(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @GetMapping("/profile/{mobile}")
  public ResponseEntity<User> getProfile(@PathVariable String mobile) {
    Optional<User> user = userRepository.findByPhone(mobile);
    return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
  }

  @PutMapping("/update/{mobile}")
  public ResponseEntity<User> updateProfile(@PathVariable String mobile, @RequestBody User updates) {
    Optional<User> userOpt = userRepository.findByPhone(mobile);
    if (userOpt.isEmpty()) {
      return ResponseEntity.notFound().build();
    }

    User user = userOpt.get();
    if (updates.getName() != null) {
      user.setName(updates.getName());
    }
    if (updates.getPhone() != null) {
      user.setPhone(updates.getPhone());
    }
    if (updates.getProfilePic() != null) {
      user.setProfilePic(updates.getProfilePic());
    }
    if (updates.getStatus() != null) {
      user.setStatus(updates.getStatus());
    }

    return ResponseEntity.ok(userRepository.save(user));
  }
}


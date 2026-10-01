package in.finora.rest;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import in.finora.entity.User;
import in.finora.exception.UserException;
import in.finora.request.UserSignInRequest;
import in.finora.request.UserSignupRequest;
import in.finora.request.UserUpdateRequest;
import in.finora.response.ApiResponse;
import in.finora.response.UserResponse;
import in.finora.service.UserService;
import in.finora.utils.JwtUtil;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // ------------------- SIGNUP -------------------
    @PostMapping("/signup")
    public ResponseEntity<?> userSignUp(@Valid @RequestBody UserSignupRequest request, BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            throw new UserException("Invalid User Input", HttpStatus.BAD_REQUEST);
        }

        // Check if email already exists
        User existingUser = userService.getUserByEmail(request.getEmail());
        if (existingUser != null) {
            throw new UserException("Email already exists", HttpStatus.CONFLICT);
        }

        // Create new user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setName(request.getName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setProfileImgUrl(request.getProfileImgUrl());
        user.setProfileImgUrlPublicId(request.getProfileImgUrlPublicId());

        // Save user to database
        user = userService.saveUser(user);

        // Generate JWT token
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", user.getEmail());
        claims.put("role", user.getRole());
        claims.put("userId", user.getId());
        String token = jwtUtil.generateToken(user.getEmail(), claims);

        // Prepare response
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Account created successfully");
        response.put("userId", user.getId());   // ✅ FIXED
        response.put("token", token);
        response.put("profileImgUrl", user.getProfileImgUrl());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // ------------------- SIGNIN -------------------
    @PostMapping("/signin")
    public ResponseEntity<?> userSignIn(@Valid @RequestBody UserSignInRequest request, BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            throw new UserException("Invalid User Input", HttpStatus.BAD_REQUEST);
        }

        User user = userService.getUserByEmail(request.getEmail());
        if (user == null) {
            throw new UserException("Email not found", HttpStatus.NOT_FOUND);
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UserException("Invalid password", HttpStatus.UNAUTHORIZED);
        }

        // Generate JWT token
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", user.getEmail());
        claims.put("role", user.getRole());
        claims.put("userId", user.getId());
        String token = jwtUtil.generateToken(user.getEmail(), claims);

        // Prepare response including profile image
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Logged in successfully");
        response.put("userId", user.getId());   // ✅ FIXED
        response.put("token", token);
        response.put("profileImgUrl", user.getProfileImgUrl());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // ------------------- GET PROFILE -------------------
    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> getUserProfile(@PathVariable Long userId) {
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new UserException("User not found", HttpStatus.NOT_FOUND));

        UserResponse userResponse = new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getProfileImgUrl(),
                user.getProfileImgUrlPublicId()
        );

        return ResponseEntity.ok(new ApiResponse<>("success", "Profile data", userResponse));
    }
    @PutMapping("/update/{userId}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long userId,
            @RequestBody UserUpdateRequest request) {

        User user = userService.getUserById(userId)
                .orElseThrow(() -> new UserException("User not found", HttpStatus.NOT_FOUND));

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        if (request.getProfileImgUrl() != null && !request.getProfileImgUrl().isEmpty()) {
            user.setProfileImgUrl(request.getProfileImgUrl());
        }

        userService.saveUser(user);

        UserResponse updated = new UserResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole(),
            user.getProfileImgUrl(),
            user.getProfileImgUrlPublicId()
        );

        return ResponseEntity.ok(new ApiResponse<>("success", "Profile updated", updated));
    }

}

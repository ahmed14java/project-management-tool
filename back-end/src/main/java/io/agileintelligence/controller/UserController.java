package io.agileintelligence.controller;

import io.agileintelligence.domain.User;
import io.agileintelligence.security.jwt.JwtTokenProvider;
import io.agileintelligence.security.payload.JWTLoginResponse;
import io.agileintelligence.security.payload.LoginRequest;
import io.agileintelligence.service.MapValidationErrorService;
import io.agileintelligence.service.UserService;
import io.agileintelligence.validator.UserValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import static io.agileintelligence.security.SecurityConstants.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {


    @Autowired
    private UserValidator userValidator;

    @Autowired
    private UserService userService;

    @Autowired
    private MapValidationErrorService mapValidationErrorService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest , BindingResult result){
        ResponseEntity<?> errorMap = mapValidationErrorService.MapValidationServiceError(result);
        if(errorMap != null){
            return errorMap;
        }
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername() , loginRequest.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = TOKEN_PREFIX + jwtTokenProvider.generateToken(authentication);
        return ResponseEntity.ok(new JWTLoginResponse(true , jwt));
    }


    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody User user , BindingResult result){
        // Validate password match
        userValidator.validate(user,result);

        ResponseEntity<?> errorMap = mapValidationErrorService.MapValidationServiceError(result);
        if(errorMap != null){
            return errorMap;
        }

        User newUser = userService.saveUser(user);

        return new ResponseEntity<User>(newUser , HttpStatus.CREATED);
    }
}

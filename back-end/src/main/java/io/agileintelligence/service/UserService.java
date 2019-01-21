package io.agileintelligence.service;

import io.agileintelligence.domain.User;
import io.agileintelligence.exceptions.UsernameAlreadyExistsException;
import io.agileintelligence.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;


    @Autowired
    private BCryptPasswordEncoder passwordEncoder;


    public User saveUser(User user){
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        //Username has to be unique (exception)
        try{
            user.setUsername(user.getUsername());
            user.setConfirmPassword("");
            User userSaved = userRepository.save(user);
            return userSaved;
        }catch (Exception e){
            throw new UsernameAlreadyExistsException("Username '" + user.getUsername() + "' Already exists");
        }

        //Make sure that password and confirmedPassword match

        //We don't persist or show the confirmPassword

    }

}

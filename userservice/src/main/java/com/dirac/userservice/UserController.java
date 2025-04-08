package com.dirac.userservice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<UserModel> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{authId}")
    public Optional<UserModel> getUserById(@PathVariable String authId) {
        return userService.getUserById(authId);
    }

    @PostMapping("")
    public String createUser(@RequestBody UserModel user) {
        try {
            UserModel createdUser = userService.createUser(user);
            return "User " + createdUser.getUsername() + " created successfully.";
        } catch (Exception e) {
            return "Error creating user: " + e.getMessage();
        }

    }

    @PutMapping("/{authId}")
    public String updateUser(@PathVariable String authId, @RequestBody UserModel updatedUser) {
        try{
            UserModel userUpdated =  userService.updateUser(authId, updatedUser);
            return "User " + userUpdated.getUsername() + " updated successfully.";
        }catch(Exception e){
            return "Error updating user: " + e.getMessage();
        }
    }

    @DeleteMapping("{authId}")
    public String deleteUser(@PathVariable String authId) {
        try{

            userService.deleteUser(authId);
        }catch(Error e){
            return "Error deleting user: " + e.getMessage();
        }
        
        return "User with authId " + authId + " deleted successfully.";
    }
}

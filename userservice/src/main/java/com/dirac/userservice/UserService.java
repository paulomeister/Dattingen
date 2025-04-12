package com.dirac.userservice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dirac.commons.exceptions.*;
import com.dirac.userservice.DTOs.UserDTO;
import com.dirac.userservice.enums.RoleEnum;

import java.util.Arrays;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Obtener todos los usuarios
    public List<UserModel> getAllUsers() {
        return userRepository.findAll();
    }

    // Obtener un usuario por ID
    public UserDTO getUserById(String _id) {
        UserModel userModel = userRepository.findById(_id)
                .orElseThrow(() -> new ResourceNotFoundException("User", _id));
        return toUserDTO(userModel);
    }

    // Obtener por nombre de Usuario
    public UserModel getUserByUsername(String username) {
        UserModel user = userRepository.findByUsername(username);
        if (user == null) {
            throw new ResourceNotFoundException("User with username", username);
        }
        return user;
    }
    

    // Crear un nuevo usuario
    public UserModel createUser(UserModel user) {
        if (user.getUsername() == null || user.getUsername().isBlank()) {
            throw new BadRequestException("Username cannot be null or empty");
        }

        if (userRepository.findByUsername(user.getUsername()) != null) {
            throw new ResourceAlreadyExistsException("User", "username: " + user.getUsername());
        }

        if(!Arrays.asList(RoleEnum.values()).contains(user.getRole())){
            throw new BadRequestException("Invalid role: " + user.getRole());
        }

        return userRepository.save(user);
    }

    // Actualizar un usuario existente
    public UserModel updateUser(String _id, UserModel updatedUser) {
        UserModel existingUser = userRepository.findById(_id)
                .orElseThrow(() -> new ResourceNotFoundException("User", _id));

        if (updatedUser.getUsername() != null) {
            existingUser.setUsername(updatedUser.getUsername());
        }
        if (updatedUser.getEmail() != null) {
            existingUser.setEmail(updatedUser.getEmail());
        }
        if (updatedUser.getRole() != null) {
            existingUser.setRole(updatedUser.getRole());
        }
        if (updatedUser.getBusinessId() != null) {
            existingUser.setBusinessId(updatedUser.getBusinessId());
        }

        return userRepository.save(existingUser);
    }

    // Eliminar un usuario
    public void deleteUser(String _id) {
        // Si no existe, lanza la excepción
        if (!userRepository.existsById(_id)) {
            throw new ResourceNotFoundException("User", _id);
        }
        userRepository.deleteById(_id);
    }

    // Convertir a DTO
    public UserDTO toUserDTO(UserModel userModel) {
        UserDTO userDTO = new UserDTO();
        userDTO.set_id(userModel.get_id());
        userDTO.setId(userModel.getId());
        userDTO.setUsername(userModel.getUsername());
        userDTO.setName(userModel.getName());
        return userDTO;
    }
}

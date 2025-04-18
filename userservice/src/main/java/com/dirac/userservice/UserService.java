package com.dirac.userservice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dirac.commons.exceptions.*;
import com.dirac.userservice.DTOs.UserDTO;
import com.dirac.userservice.enums.RoleEnum;

import java.util.Arrays;
import java.util.EnumSet;
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
    
    // Obtener usuarios por Business
    public List<UserModel> getUsersByBusinessId(String businessId) {
        List<UserModel> users = userRepository.findByBusinessId(businessId);
        if (users.isEmpty()) {
            throw new ResourceNotFoundException("Users with businessId", businessId);
        }
        return users;
    }   


    // Crear un nuevo usuario
    // NOTA: No importa si el usuario se crea sin un bussinessId,
    // ya que el usuario puede ir creando sus credenciales y más adelante
    // asociarse a un negocio. 
    // En este caso, el businessId se puede dejar como null.
    public UserModel createUser(UserModel user) {
        // Validar username
        if (user.getUsername() == null || user.getUsername().isBlank()) {
            throw new BadRequestException("Username cannot be null or empty");
        }

        // Validar unicidad
        if (userRepository.findByUsername(user.getUsername()) != null) {
            throw new ResourceAlreadyExistsException("User", "username: " + user.getUsername());
        }

        // Validar rol
        if (user.getRole() == null || !EnumSet.allOf(RoleEnum.class).contains(user.getRole())) {
            throw new BadRequestException("Invalid role: " + user.getRole());
        }

        // businessId puede ser null — se documenta, no se valida

        return userRepository.save(user);
    }

    // Asignar usuarios a un negocio => Devuelve el número de usuarios actualizados
    // NOTA: Se puede asignar un usuario a un negocio diferente al que ya tiene.
    public int assignUsersToBusiness(List<String> userIds, String businessId) {
        int count = 0;
        for (String userId : userIds) {
            UserModel user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", userId));
            
            if (!businessId.equals(user.getBusinessId())) {
                user.setBusinessId(businessId);
                userRepository.save(user);
                count++;
            }
        }
        return count;
    }


    // Actualizar un usuario existente
    public UserModel updateUser(String _id, UserModel updatedUser) {

        // Si no existe, lanza la excepción
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

        // Validar unicidad del username    

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
        userDTO.setAuthId(userModel.getAuthid());
        userDTO.setUsername(userModel.getUsername());
        userDTO.setName(userModel.getName());
        userDTO.setBussinessId(userModel.getBusinessId());
        return userDTO;
    }
}

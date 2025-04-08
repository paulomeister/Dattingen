package com.dirac.userservice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Crear un nuevo usuario
    public UserModel createUser(UserModel user) {
        return userRepository.save(user);
    }

    // Obtener todos los usuarios
    public List<UserModel> getAllUsers() {
        return userRepository.findAll();
    }

    // Obtener un usuario por ID
    public Optional<UserModel> getUserById(String authId) {
        return userRepository.findById(authId);
    }

    // Método para actualizar un usuario
    public UserModel updateUser(String authId, UserModel updatedUser) {
        // Buscar el usuario por su authId
        Optional<UserModel> userOptional = userRepository.findById(authId);

        if (userOptional.isPresent()) {
            // Obtener el usuario actual
            UserModel existingUser = userOptional.get();

            // Actualizar solo los campos proporcionados
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

            // Guardar el usuario actualizado en la base de datos
            return userRepository.save(existingUser);
        } else {
            return null; // Si el usuario no existe, retornamos null
        }
    }

    // Eliminar un usuario
    public void deleteUser(String authId) {
        // Verificamos si el usuario existe antes de eliminarlo
        try{
            userRepository.findById(authId).orElseThrow(() -> new Exception("User not found with authId: " + authId));
        } catch (Exception e) {
            throw new Error("User not found with authId: " + authId);
        }
        // Si el usuario existe, lo eliminamos
        userRepository.deleteById(authId);
    }
}

package com.dirac.userservice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dirac.commons.exceptions.*;
import com.dirac.userservice.DTOs.UserDTO;
import com.dirac.userservice.Enums.RoleEnum;

import java.util.EnumSet;
import java.util.List;

import javax.management.relation.Role;

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

    // Nuevo método: Buscar usuarios por nombre o username
    public List<UserModel> searchUsers(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            throw new BadRequestException("Search term cannot be empty");
        }

        List<UserModel> users = userRepository.findByUsernameOrNameContainingIgnoreCase(searchTerm);

        if (users.isEmpty()) {
            throw new ResourceNotFoundException("Users matching search term", searchTerm);
        }

        return users;
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
    // NOTA: No importa si el usuario se crea sin un businessId,
    // ya que el usuario puede ir creando sus credenciales y más adelante
    // asociarse a un negocio.
    // En este caso, el businessId se puede dejar como null.
    public UserModel createUser(UserModel user) {

        // Validar campos obligatorios

        // Validar Correo
        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new ResourceAlreadyExistsException("User", "Email:" + user.getEmail());
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

            // Validar unicidad
            if (userRepository.findByUsername(updatedUser.getUsername()) != null) {
                throw new ResourceAlreadyExistsException("User", "username: " + updatedUser.getUsername());
            }
            // Validar username
            existingUser.setUsername(updatedUser.getUsername());
        }
        if (updatedUser.getEmail() != null) {
            // Validar email
            if (userRepository.findByEmail(updatedUser.getEmail()) != null) {
                throw new ResourceAlreadyExistsException("User", "email: " + updatedUser.getEmail());
            }

            existingUser.setEmail(updatedUser.getEmail());
        }
        if (updatedUser.getName() != null) {
            existingUser.setName(updatedUser.getName());
        }
        if (updatedUser.getLanguage() != null) {
            existingUser.setLanguage(updatedUser.getLanguage());
        }

        return userRepository.save(existingUser);

    }

    // Eliminar un usuario
    public void deleteUser(String _id) {

        UserModel user = userRepository.findById(_id)
                .orElseThrow(() -> new ResourceNotFoundException("User", _id));

        // Validar que el rol no sea ni Admin ni AuditorInterno
        if (!user.getRole().equals(RoleEnum.ExternalAuditor)) {
            throw new BadRequestException("Cannot delete user with role: " + user.getRole());
        }

        // Si el usuario está asociado a una empresa:
        // 1. Eliminar la asociación con la empresa
        if (user.getBusinessId() != null) {
            // TODO!!!
            // Ir al servicio de negocio y eliminar la asociación
            // businessService.removeUserFromBusiness(user.getBusinessId(), _id);
        }

        userRepository.deleteById(_id);
    }

    public List<UserModel> getUsersByRole(RoleEnum role) {

        return userRepository.findByRole(role);

    }

    public UserModel getRandomExternalAuditor() {
        List<UserModel> auditors = userRepository.findByRole(RoleEnum.ExternalAuditor);
        if (auditors.isEmpty()) {
            throw new ResourceNotFoundException("Users", "External Auditors");
        }
        return auditors.get((int) (Math.random() * auditors.size()));
    }

    // Convertir a DTO
    public UserDTO toUserDTO(UserModel userModel) {
        UserDTO userDTO = new UserDTO();
        userDTO.set_id(userModel.get_id());
        userDTO.setUsername(userModel.getUsername());
        userDTO.setName(userModel.getName());
        userDTO.setRole(userModel.getRole());
        userDTO.setLanguage(userModel.getLanguage());
        userDTO.setBusinessId(userModel.getBusinessId());
        return userDTO;
    }
}

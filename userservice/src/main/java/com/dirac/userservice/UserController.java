package com.dirac.userservice;

import com.dirac.userservice.DTOs.ResponseDTO;
import com.dirac.userservice.DTOs.UserDTO;
import com.dirac.userservice.DTOs.UsersAssignDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    // Obtener todos los usuarios
    @GetMapping("/")
    @PreAuthorize("hasAnyRole('admin', 'Coordinator')")
    public ResponseEntity<ResponseDTO<Object>> getAllUsers() {
        log.info("Fetching all users");
        var users = userService.getAllUsers()
                .stream()
                .map(userService::toUserDTO)
                .collect(Collectors.toList());
        log.info("Retrieved {} users", users.size());
        return ResponseEntity.ok(new ResponseDTO<>(200, "Users retrieved successfully", users));
    }

    // Buscar usuario por username exacto
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('admin', 'Coordinator', 'InternalAuditor', 'ExternalAuditor')")
    public ResponseEntity<ResponseDTO<UserDTO>> getUserByUsername(@RequestParam String username) {
        log.info("Searching for user by username: {}", username);
        UserModel user = userService.getUserByUsername(username);
        if (user != null) {
            log.info("User found: _id={}, username={}", user.get_id(), user.getUsername());
        } else {
            log.warn("User not found for username: {}", username);
        }
        return ResponseEntity.ok(new ResponseDTO<>(200, "User Found", userService.toUserDTO(user)));
    }
    
    // Nuevo endpoint: Buscar usuarios por nombre o username (búsqueda parcial)
    @GetMapping("/search/users")
    @PreAuthorize("hasAnyRole('admin', 'Coordinator')")
    public ResponseEntity<ResponseDTO<List<UserDTO>>> searchUsers(@RequestParam String q) {
        log.info("Searching users by query: {}", q);
        List<UserModel> users = userService.searchUsers(q);
        List<UserDTO> userDTOs = users.stream()
                .map(userService::toUserDTO)
                .collect(Collectors.toList());
        log.info("Found {} users matching query '{}'", userDTOs.size(), q);
        return ResponseEntity.ok(new ResponseDTO<>(200, 
                "Found " + userDTOs.size() + " users matching: " + q, 
                userDTOs));
    }

    // Obtener usuario por ID
    @GetMapping("/{_id}")
    @PreAuthorize("hasAnyRole('admin', 'Coordinator') or @userService.isOwner(#_id, authentication.name)")
    public ResponseEntity<ResponseDTO<UserDTO>> getUserById(@PathVariable String _id) {
        log.info("Fetching user by _id: {}", _id);
        UserDTO user = userService.getUserById(_id);
        if (user != null) {
            log.info("User found: _id={}", _id);
        } else {
            log.warn("User not found for _id: {}", _id);
        }
        return ResponseEntity.ok(new ResponseDTO<>(200, "User Found", user));
    }

    // Obtener usuarios por Business
    @GetMapping("/business/{businessId}/users")
    @PreAuthorize("hasAnyRole('admin', 'Coordinator', 'InternalAuditor')")
    public ResponseEntity<ResponseDTO<List<UserDTO>>> getUsersByBusinessId(@PathVariable String businessId) {
        log.info("Fetching users for businessId: {}", businessId);
        List<UserModel> users = userService.getUsersByBusinessId(businessId);
        List<UserDTO> userDTOs = users.stream()
                .map(userService::toUserDTO)
                .toList();
        log.info("Found {} users for businessId {}", userDTOs.size(), businessId);
        return ResponseEntity.ok(new ResponseDTO<>(200, "Users from business " + businessId, userDTOs));
    }

    // | WARNING: user creation should only happen upon credentials creation
    // (see securityservice/src/main/java/com/dirac/securityservice/Controller/CredentialsController.java)
    @PostMapping("/")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<ResponseDTO<UserDTO>> createUser(@RequestBody UserModel user) {
        log.info("Creating user with username: {}", user.getUsername());
        UserDTO userDTO = userService.toUserDTO(userService.createUser(user));
        log.info("User created with _id: {}", userDTO.get_id());
        return ResponseEntity.status(201)
                .body(new ResponseDTO<>(201, "User created with _id: " + userDTO.get_id(), userDTO));
    }

    // Linkear usuarios a un determinado negocio:
    @PostMapping("/businesses/{businessId}/users")
    @PreAuthorize("hasAnyRole('admin', 'Coordinator')")
    public ResponseEntity<ResponseDTO<Object>> assignUsersToBusiness(
            @PathVariable String businessId,
            @RequestBody UsersAssignDTO assignUsersDTO) {

        log.info("Assigning users {} to business {}", assignUsersDTO.getUserIds(), businessId);
        int updatedCount = userService.assignUsersToBusiness(assignUsersDTO.getUserIds(), businessId);
        log.info("{} user(s) assigned to business {}", updatedCount, businessId);

        return ResponseEntity.ok(new ResponseDTO<>(200,
                updatedCount + " user(s) assigned to business " + businessId, null));
    }

    // Actualizar usuario
    @PutMapping("/{_id}")
    @PreAuthorize("hasAnyRole('admin', 'Coordinator') or @userService.isOwner(#_id, authentication.name)")
    public ResponseEntity<ResponseDTO<UserDTO>> updateUser(@PathVariable String _id,
            @RequestBody UserModel updatedUser) {
        log.info("Updating user with _id: {}", _id);
        UserDTO userDTO = userService.toUserDTO(userService.updateUser(_id, updatedUser));
        log.info("User updated: _id={}", _id);
        return ResponseEntity.ok(new ResponseDTO<>(200, "User Updated!", userDTO));
    }

    // Eliminar usuario
    @DeleteMapping("/{_id}")
    @PreAuthorize("hasAnyRole('admin', 'Coordinator') or @userService.isOwner(#_id, authentication.name)")
    public ResponseEntity<ResponseDTO<Object>> deleteUser(@PathVariable String _id) {
        log.info("Deleting user with _id: {}", _id);
        userService.deleteUser(_id);
        log.info("User deleted with _id: {}", _id);
        return ResponseEntity.ok(new ResponseDTO<>(200, "User deleted with id: " + _id, null));
    }
}

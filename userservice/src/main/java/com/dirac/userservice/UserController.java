package com.dirac.userservice;

import com.dirac.userservice.DTOs.ResponseDTO;
import com.dirac.userservice.DTOs.UserDTO;
import com.dirac.userservice.DTOs.UsersAssignDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    // Obtener todos los usuarios
    @GetMapping("/")
    public ResponseEntity<ResponseDTO<Object>> getAllUsers() {
        var users = userService.getAllUsers()
                .stream()
                .map(userService::toUserDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(new ResponseDTO<>(200, "Users retrieved successfully", users));
    }

    @GetMapping("/search")
    public ResponseEntity<ResponseDTO<UserDTO>> getUserByUsername(@RequestParam String username) {
        UserModel user = userService.getUserByUsername(username);
        return ResponseEntity.ok(new ResponseDTO<>(200, "User Found", userService.toUserDTO(user)));
    }
    

    // Obtener usuario por ID
    @GetMapping("/{_id}")
    public ResponseEntity<ResponseDTO<UserDTO>> getUserById(@PathVariable String _id) {
        UserDTO user = userService.getUserById(_id);
        return ResponseEntity.ok(new ResponseDTO<>(200, "User Found", user));
    }

    // Obtener usuarios por Business
    @GetMapping("/business/{businessId}/users")
    public ResponseEntity<ResponseDTO<List<UserDTO>>> getUsersByBusinessId(@PathVariable String businessId) {
        List<UserModel> users = userService.getUsersByBusinessId(businessId);
        List<UserDTO> userDTOs = users.stream()
                                    .map(userService::toUserDTO)
                                    .toList();
        return ResponseEntity.ok(new ResponseDTO<>(200, "Users from business " + businessId, userDTOs));
    }


    // Crear nuevo usuario
    @PostMapping("/")
    public ResponseEntity<ResponseDTO<UserDTO>> createUser(@RequestBody UserModel user) {
        UserDTO userDTO = userService.toUserDTO(userService.createUser(user));
        return ResponseEntity.status(201)
                .body(new ResponseDTO<>(201, "User created with _id: " + userDTO.get_id(), userDTO));
    }

    // Linkear usuarios a un determinado negocio:
    @PostMapping("/businesses/{businessId}/users")
    public ResponseEntity<ResponseDTO<Object>> assignUsersToBusiness(
            @PathVariable String businessId,
            @RequestBody UsersAssignDTO assignUsersDTO) {
    
        int updatedCount = userService.assignUsersToBusiness(assignUsersDTO.getUserIds(), businessId);
    
        return ResponseEntity.ok(new ResponseDTO<>(200,
            updatedCount + " user(s) assigned to business " + businessId, null));
    }
    



    // Actualizar usuario
    @PutMapping("/{_id}")
    public ResponseEntity<ResponseDTO<UserDTO>> updateUser(@PathVariable String _id, @RequestBody UserModel updatedUser) {
        UserDTO userDTO = userService.toUserDTO(userService.updateUser(_id, updatedUser));
        return ResponseEntity.ok(new ResponseDTO<>(200, "User Updated!", userDTO));
    }

    // Eliminar usuario
    @DeleteMapping("/{_id}")
    public ResponseEntity<ResponseDTO<Object>> deleteUser(@PathVariable String _id) {
        userService.deleteUser(_id);
        return ResponseEntity.ok(new ResponseDTO<>(200, "User deleted with id: " + _id, null));
    }
}

package com.dirac.userservice;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.dirac.userservice.Enums.RoleEnum;

public interface UserRepository extends MongoRepository<UserModel, String> {
    // Custom query methods can be defined here if needed

    public UserModel findByEmail(String email);

    public List<UserModel> findByRole(RoleEnum role);

    public UserModel findByUsername(String username);

    public List<UserModel> findByBusinessId(String businessId);

    // Método para buscar usuarios por nombre o username
    @Query("{ $or: [ { 'username': { $regex: ?0, $options: 'i' } }, { 'name': { $regex: ?0, $options: 'i' } } ] }")
    public List<UserModel> findByUsernameOrNameContainingIgnoreCase(String searchTerm);
}

package com.dirac.securityservice.Repository;

import com.dirac.securityservice.Model.UsersModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for managing user data in MongoDB.
 * This interface extends the MongoRepository interface provided by Spring Data MongoDB.
 * It allows for CRUD operations and custom queries on the UsersModel collection.
 *
 * @author Jean Paul Delgado Jurado
 * @version 1.0
 * @since 2025-05-02
 */
@Repository
public interface IUsersRepository extends MongoRepository<UsersModel, String> {

    /**
     * Finds a user by their username.
     *
     * @param username the username to search for
     * @return an Optional containing the found UsersModel, or empty if not found
     * Case insensitive search is performed using a regex query.
     */
    @Query("{'username': {$regex: ?0, $options:  'i'}}")
    Optional<UsersModel> findUserByUsername(String username);

    @Query("{'email': ?0}")
    Optional<UsersModel> findByEmail(String email);

}

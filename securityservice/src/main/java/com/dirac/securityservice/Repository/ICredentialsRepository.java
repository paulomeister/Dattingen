package com.dirac.securityservice.Repository;

import com.dirac.securityservice.Model.CredentialsModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for managing credentials in the database.
 * Extends MongoRepository to provide CRUD operations.
 *
 * @author Jean Paul Delgado Jurado
 * @version 1.0
 * @since 2025-05-02
 */
@Repository
public interface ICredentialsRepository extends MongoRepository<CredentialsModel, String> {

    /**
     * Finds a CredentialsModel by username or email.
     *
     * @param identifier the username or email to search for
     * @return an Optional containing the found CredentialsModel, or empty if not found
     * Searches for a CredentialsModel by either username or email using a case-insensitive regex.
     */
    @Query("{ $or: [ {'username': {$regex: ?0, $options: 'i'}}, {'email': {$regex: ?0, $options: 'i'}} ] }")
    Optional<CredentialsModel> findCredentialsById(String identifier);

}

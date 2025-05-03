package com.dirac.securityservice.Security.DAO;

import com.dirac.securityservice.Security.AppUser;

import java.util.Optional;

/**
 * Interface for user data access object (DAO).
 * This interface defines methods for accessing user data.
 * It is used to interact with the underlying data source (e.g., database).
 *
 * @author Jean Paul Delgado Jurado
 * @version 1.0
 * @since 2025-05-02
 */
public interface IUserDao {

    Optional<AppUser> selectUserByUsername(String username);

}

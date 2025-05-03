package com.dirac.securityservice.Security.DAO;

import com.dirac.securityservice.Security.AppUser;
import com.dirac.securityservice.Service.Contracts.ICredentialsService;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * UserDaoImpl is a Data Access Object (DAO) implementation for managing user data.
 * It interacts with the credentials service to retrieve user information.
 * This class implements the IUserDao interface.
 * It is annotated with @Repository to indicate that it is a DAO component.
 * It is a Spring-managed bean.
 * It is used to access user data from the database.
 * Easily replaceable with another implementation.
 *
 * @author Jean Paul Delgado Jurado
 * @version 1.0
 * @since 2025-05-02
 */
@Repository("UserDaoImpl")
public class UserDaoImpl implements IUserDao {

    private final ICredentialsService credentialsService;

    public UserDaoImpl(ICredentialsService credentialsService) {
        this.credentialsService = credentialsService;
    }

    @Override
    public Optional<AppUser> selectUserByUsername(String username) {

        return Optional.ofNullable(credentialsService.mapCredentialsFromDatabase(username));

    }
}

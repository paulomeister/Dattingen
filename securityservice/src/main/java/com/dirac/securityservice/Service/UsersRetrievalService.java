package com.dirac.securityservice.Service;

import com.dirac.securityservice.Security.DAO.IUserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import static java.lang.String.format;

/**
 * Service for retrieving user details.
 * Implements UserDetailsService to load user-specific data.
 * This service is used by Spring Security to authenticate users.
 * It retrieves user details from the database using an IUserDao implementation (UserDaoImpl).
 *
 * @author Jean Paul Delgado Jurado
 * @version 1.0
 * @since 2025-05-02
 */
@Service
public class UsersRetrievalService implements UserDetailsService {

    private final IUserDao userDao;

    @Autowired
    public UsersRetrievalService(@Qualifier("UserDaoImpl") IUserDao userDao) {
        this.userDao = userDao;
    }

    /**
     * Loads user details by username.
     *
     * @param username the username of the user to load
     * @return UserDetails object containing user information
     * @throws UsernameNotFoundException if the user is not found
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userDao.selectUserByUsername(username).
                orElseThrow(() -> new UsernameNotFoundException(format("User \"%s\" not found", username)));
    }

}

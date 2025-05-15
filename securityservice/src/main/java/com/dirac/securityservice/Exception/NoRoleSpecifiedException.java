package com.dirac.securityservice.Exception;

/**
 * Exception thrown when no role is specified for a user.
 *
 * @author Jean Paul Delgado Jurado
 * @version 1.0
 * @since 2025-05-02
 */
public class NoRoleSpecifiedException extends RuntimeException {

    public NoRoleSpecifiedException(String message) {
        super(message);
    }

}

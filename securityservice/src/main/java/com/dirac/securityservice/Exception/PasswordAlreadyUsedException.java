package com.dirac.securityservice.Exception;

/**
 * Exception thrown when a user tries to set a password that has already been used.
 *
 * @author Jean Paul Delgado Jurado
 * @version 1.0
 * @since 2025-05-02
 */
public class PasswordAlreadyUsedException extends RuntimeException {

    public PasswordAlreadyUsedException(String message) {
        super(message);
    }

}

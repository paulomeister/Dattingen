package com.dirac.securityservice.Exception;

/**
 * Exception thrown when an active password is not found.
 *
 * @author Jean Paul Delgado Jurado
 * @version 1.0
 * @since 2025-05-02
 */
public class ActivePasswordNotFoundException extends RuntimeException {

    public ActivePasswordNotFoundException(String message) {
        super(message);
    }

}

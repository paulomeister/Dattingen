package com.dirac.securityservice.Exception;

/**
 * Custom exception to indicate that a secret (the answer to a security question) is invalid.
 *
 * @author Jean Paul Delgado Jurado
 * @version 1.0
 * @since 2025-05-02
 */
public class InvalidSecretException extends RuntimeException {

    public InvalidSecretException(String message) {
        super(message);
    }
}

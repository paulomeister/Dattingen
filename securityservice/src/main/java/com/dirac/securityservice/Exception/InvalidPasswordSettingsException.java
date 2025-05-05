package com.dirac.securityservice.Exception;

/**
 * Exception thrown when the password settings are invalid.
 *
 * @author Jean Paul Delgado Jurado
 * @version 1.0
 * @since 2025-05-02
 */
public class InvalidPasswordSettingsException extends RuntimeException {

    public InvalidPasswordSettingsException(String message) {
        super(message);
    }
}

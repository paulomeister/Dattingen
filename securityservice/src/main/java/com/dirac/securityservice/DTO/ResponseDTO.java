package com.dirac.securityservice.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * ResponseDTO is a generic class that represents the structure of the response
 * returned by the API. It contains a status code, a message, and the data of
 * type T.
 *
 * @param <T> the type of the data in the response
 *
 * @author Jean Paul Delgado Jurado
 * @version 1.0
 * @since 2025-05-02
 */
@AllArgsConstructor
@Data
public class ResponseDTO<T> {

    private int status;
    private String message;
    private T data;

}

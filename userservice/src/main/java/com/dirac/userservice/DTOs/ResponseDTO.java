package com.dirac.userservice.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResponseDTO<T>{
    public int status;
    public String message;
    public T data; // Esto es la Data que se envía si se resuelve la petición!

}
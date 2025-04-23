package com.dirac.businessservice.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResponseDTO<T> {
    public int status;
    public String message;
    public T data;
}

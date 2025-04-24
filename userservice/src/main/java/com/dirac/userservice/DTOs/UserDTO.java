package com.dirac.userservice.DTOs;

import com.dirac.userservice.enums.RoleEnum;

import lombok.Data;

@Data
public class UserDTO {
    private String _id;
    private RoleEnum role;
    private String businessId; //  This had to be implemented! Sorry for the delay.
    private String language;
    private String name;
    private String username;
}

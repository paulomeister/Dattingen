package com.dirac.userservice.DTOs;

import lombok.Data;

@Data

public class UserDTO {
    private String _id;
    private String username;
    private String name;
    private String language;
    private String bussinessId; //  This had to be implemented! Sorry for the delay.
}

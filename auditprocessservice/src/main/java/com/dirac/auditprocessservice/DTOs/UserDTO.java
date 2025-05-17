package com.dirac.auditprocessservice.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private String _id;
    private RoleEnum role;
    private String businessId; // This had to be implemented! Sorry for the delay.
    private String language;
    private String name;
    private String username;

    public enum RoleEnum {
        admin,
        Coordinator,
        InternalAuditor,
        ExternalAuditor,
    }

}

package com.dirac.userservice.DTOs;

import java.util.List;

// DTO para la asignación de usuarios a un negocio o rol específico
// Se utiliza para recibir una lista de IDs de usuarios en una solicitud
public class UsersAssignDTO {
    private List<String> userIds;

    public List<String> getUserIds() {
        return userIds;
    }

    public void setUserIds(List<String> userIds) {
        this.userIds = userIds;
    }
}

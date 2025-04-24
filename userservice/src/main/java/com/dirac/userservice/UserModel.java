package com.dirac.userservice;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.dirac.userservice.enums.RoleEnum;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "Users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserModel {

    @Id
    private String _id;
    private String username;
    private String name;
    private String email;
    private String language; // nuevo atributo
    private RoleEnum role;
    private String businessId;  

}

package com.dirac.securityservice.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import static com.dirac.securityservice.Model.CredentialsModel.*;

/**
 * DTO for new credentials.
 * This class is used to transfer data related to new user credentials.
 * It may contain fields such as username, name, email, profile information, password, and security question.
 *
 * @author Jean Paul Delgado Jurado
 * @version 1.0
 * @since 2025-05-02
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
public class NewCredentialsDTO {

    private String username;
    private String name;
    private String email;
    private String language;
    private String password;
    private String role;
    private SecurityQuestion securityQuestion;

}

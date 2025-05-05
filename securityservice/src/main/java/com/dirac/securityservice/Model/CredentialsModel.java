package com.dirac.securityservice.Model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

/**
 * This class represents the credentials model for the application.
 * It contains fields for username, email, password, role, account status,
 * security question, and a list of credentials logs.
 *
 * @author Jean Paul Delgado Jurado
 * @version 1.0
 * @since 2025-05-02
 */
@Document(collection = "Credentials")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class CredentialsModel {

    @Id
    private ObjectId _id;
    private String username;
    private String email;
    private String password;
    private String role;
    private boolean isAccountNonExpired;
    private boolean isAccountNonLocked;
    private boolean isCredentialsNonExpired;
    private boolean isEnabled;
    private SecurityQuestion securityQuestion;
    private List<CredentialsLog> credentialsLogs;


    @JsonProperty("_id")
    public String returnIdAsString() { return _id != null ? _id.toHexString() : null; }

    @AllArgsConstructor
    @NoArgsConstructor
    @Data
    public static class SecurityQuestion {

        private String securityQuestion;
        private String securityAnswer;

    }


    @AllArgsConstructor
    @NoArgsConstructor
    @Data
    public static class CredentialsLog {

        private String storedPassword;
        private boolean isActive;

    }

}

package com.dirac.securityservice.Model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Model for user credentials.
 * It may contain fields such as username, email, password, role, security question, and businessId (which links a user to a business).
 *
 * @author Jean Paul Delgado Jurado
 * @version 1.0
 * @since 2025-05-02
 */
@Document(collection = "Users")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class UsersModel {

    @Id
    private ObjectId _id;

    @JsonProperty("_id")
    public String get_idAString() {
        return _id != null ? _id.toHexString() : null;
    }

    private String username;
    private String name;
    private String email;
    private String language;
    private String role;
    private String businessId;

}

package com.dirac.securityservice.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for forgot password requests.
 * This class is used to transfer data related to forgot password requests.
 * It may contain fields such as the username, security question answer, and new password.
 *
 * @author Jean Paul Delgado Jurado
 * @version 1.0
 * @since 2025-05-02
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ForgotPasswordDTO {

    private String username;
    private String securityQuestionAnswer;
    private String newPassword;

}

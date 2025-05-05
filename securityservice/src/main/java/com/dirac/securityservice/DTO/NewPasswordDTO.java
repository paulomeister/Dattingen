package com.dirac.securityservice.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for new password requests.
 * This class is used to transfer data related to new password requests.
 * It may contain fields such as the new password, confirmation password, etc.
 *
 * @author Jean Paul Delgado Jurado
 * @version 1.0
 * @since 2025-05-02
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
public class NewPasswordDTO {

    private String oldPassword;
    private String newPassword;

}





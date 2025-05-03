package com.dirac.securityservice.Service.Contracts;

import com.dirac.securityservice.DTO.ForgotPasswordDTO;
import com.dirac.securityservice.DTO.NewPasswordDTO;
import com.dirac.securityservice.Model.CredentialsModel;
import com.dirac.securityservice.Model.UsersModel;
import com.dirac.securityservice.Security.AppUser;
import com.fasterxml.jackson.core.JsonProcessingException;

import java.util.Optional;

import static com.dirac.securityservice.Model.CredentialsModel.*;

/**
 * Interface for managing user credentials, defined as an implementation contract.
 * This interface defines methods for creating, updating, and deleting user credentials,
 * as well as retrieving user information and handling password recovery.
 *
 * @author Jean Paul Delgado Jurado
 * @version 1.0
 * @since 2025-05-02
 */
public interface ICredentialsService {

    AppUser mapCredentialsFromDatabase(String identifier);
    Optional<CredentialsModel> getByUsername(String username);
    void createNewCredentials(String incomingUserJsonString) throws JsonProcessingException;
    UsersModel createNewUser(String incomingUserJsonString)  throws JsonProcessingException;
    String changePassword(NewPasswordDTO incomingData);
    String getSecurityQuestion(String username);
    String forgotPasswordRecovery(ForgotPasswordDTO incomingCredentials);
    String changeSecurityQuestion(String username, SecurityQuestion newQuestion);
    String deleteCredentials(String credencialId);

}

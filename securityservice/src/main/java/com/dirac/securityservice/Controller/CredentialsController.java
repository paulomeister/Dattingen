package com.dirac.securityservice.Controller;

import com.dirac.securityservice.DTO.ForgotPasswordDTO;
import com.dirac.securityservice.DTO.NewPasswordDTO;
import com.dirac.securityservice.DTO.ResponseDTO;
import com.dirac.securityservice.Exception.*;
import com.dirac.securityservice.Model.UsersModel;
import com.dirac.securityservice.Service.Contracts.ICredentialsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import static com.dirac.securityservice.Model.CredentialsModel.*;

/**
 * CredentialsController is a REST controller that handles requests related to user credentials and security questions.
 * It provides endpoints for creating new credentials, changing and retrieving security questions, changing passwords, and recovering passwords.
 * Traceability is provided through the use of ResponseDTO objects.
 * @author Jean Paul Delgado Jurado
 * @version 1.0
 * @since 2025-05-02
 */
@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class CredentialsController {

    private final ICredentialsService credentialsService;

    public CredentialsController(ICredentialsService credentialsService) {
        this.credentialsService = credentialsService;
    }

    /**
     * Creates new user credentials and user account.
     *
     * @param incomingString the incoming string containing user information
     * @return a ResponseEntity with the status and message
     */
    @PostMapping("/signup")
    public ResponseEntity<?> createNewCredentials(@RequestParam("incomingString") String incomingString) {

        try {

            credentialsService.createNewCredentials(incomingString);
            UsersModel newUser = credentialsService.createNewUser(incomingString);

            return ResponseEntity.status(HttpStatus.OK).body(new ResponseDTO<UsersModel>(200, "User and credentials created successfully!", newUser));

        }
        catch (UserAlreadyExistsException e) {

            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());

        }
        catch (Exception e) {

            return ResponseEntity.status(500).body("ERROR: " + e.getMessage());

        }

    }

    /**
     * Changes the security question for a user.
     *
     * @param incomingData the new security question data
     * @param username     the username of the user
     * @return a ResponseEntity with the status and message
     */
    @PutMapping("/securityQuestion/change/{username}")
    public ResponseEntity<?> changeSecurityQuestion(@RequestBody SecurityQuestion incomingData,
                                                    @PathVariable("username") String username) {

        try {

            String response = credentialsService.changeSecurityQuestion(username, incomingData);
            return ResponseEntity.status(HttpStatus.OK).body(new ResponseDTO<String>(200, "Task performed", response));

        }
        catch (Exception e) {

           return ResponseEntity.status(500).body(new ResponseDTO<String>(500, "Error occurred while performing task", e.getMessage()));

        }

    }

    /**
     * Changes the password for a user.
     *
     * @param incomingData the new password data
     * @return a ResponseEntity with the status and message
     */
    @PostMapping("/password/change")
    public ResponseEntity<?> changePassword(@RequestBody NewPasswordDTO incomingData) {

        try {

            String response = credentialsService.changePassword(incomingData);
            return ResponseEntity.status(HttpStatus.OK).body(new ResponseDTO<String>(200,"Task performed", response));

        }
        catch (InvalidPasswordSettingsException | PasswordAlreadyUsedException e) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO<String>(400, "Error occurred while performing task", e.getMessage()));

        }
        catch (UsernameNotFoundException | ActivePasswordNotFoundException e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ResponseDTO<String>(500, "Error occurred while performing task", e.getMessage()));

        }

    }

    /**
     * Retrieves the security question for a user.
     *
     * @param username the username of the user
     * @return a ResponseEntity with the status and security question
     */
    @GetMapping("securityQuestion/{username}")
    public ResponseEntity<?> getSecurityQuestion(@PathVariable("username") String username) {

        try {

            String securityQuestion = credentialsService.getSecurityQuestion(username);
            return ResponseEntity.status(HttpStatus.OK).body(new ResponseDTO<String>(200,"Task performed", securityQuestion));

        }
        catch(UsernameNotFoundException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseDTO<String>(404, "Error occurred while performing task", e.getMessage()));

        }

    }

    /**
     * Recovers the password for a user.
     *
     * @param incomingData the data for password recovery
     * @return a ResponseEntity with the status and message
     */
    @PostMapping("passwordRecovery")
    public ResponseEntity<?> recoverPassword(@RequestBody ForgotPasswordDTO incomingData) {

        try {

            String response = credentialsService.forgotPasswordRecovery(incomingData);

            return ResponseEntity.status(HttpStatus.OK).body(new ResponseDTO<String>(200,"Task performed", response));

        }
        catch(UsernameNotFoundException | InvalidPasswordSettingsException | PasswordAlreadyUsedException |
              InvalidSecretException e) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO<String>(400, "Error occurred while performing task", e.getMessage()));

        }
        catch(ActivePasswordNotFoundException e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ResponseDTO<String>(500, "Error occurred while performing task", e.getMessage()));


        }

    }

}

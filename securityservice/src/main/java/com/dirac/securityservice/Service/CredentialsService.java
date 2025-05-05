package com.dirac.securityservice.Service;

import com.dirac.securityservice.DTO.ForgotPasswordDTO;
import com.dirac.securityservice.DTO.NewCredentialsDTO;
import com.dirac.securityservice.DTO.NewPasswordDTO;
import com.dirac.securityservice.Exception.*;
import com.dirac.securityservice.Model.CredentialsModel;
import com.dirac.securityservice.Model.CredentialsModel.CredentialsLog;
import com.dirac.securityservice.Model.UsersModel;
import com.dirac.securityservice.Repository.ICredentialsRepository;
import com.dirac.securityservice.Repository.IUsersRepository;
import com.dirac.securityservice.Security.AppUser;
import com.dirac.securityservice.Service.Contracts.ICredentialsService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.base.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Pattern;

import static com.dirac.securityservice.Model.CredentialsModel.*;
import static com.dirac.securityservice.Security.UserPermissionPerRole.*;
import static java.lang.String.format;

/**
 * CredentialsService is a service class that handles user credentials and security-related operations.
 * It provides methods for creating new credentials, changing passwords, managing security questions, and some more.
 *
 * @author Jean Paul Delgado Jurado
 * @version 1.0
 * @since 2025-05-02
 */
@Service
public class CredentialsService implements ICredentialsService {

    private final ICredentialsRepository credentialsRepository;
    private final IUsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public CredentialsService(ICredentialsRepository credentialsRepository, IUsersRepository usersRepository, PasswordEncoder passwordEncoder) {
        this.credentialsRepository = credentialsRepository;
        this.usersRepository = usersRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public AppUser mapCredentialsFromDatabase(String identifier) throws NoRoleSpecifiedException {

        CredentialsModel credentials = credentialsRepository.findCredentialsById(identifier)
                .orElseThrow(() -> new UsernameNotFoundException(
                        format("User \"%s\" not found in database!", identifier)));

        Set<SimpleGrantedAuthority> grantedAuthorities = getGrantedAuthorities(identifier, credentials);

        return new AppUser(

                credentials.getUsername(),
                credentials.getPassword(),
                grantedAuthorities,
                credentials.isAccountNonExpired(),
                credentials.isAccountNonLocked(),
                credentials.isCredentialsNonExpired(),
                credentials.isEnabled()

        );
    }

    private static Set<SimpleGrantedAuthority> getGrantedAuthorities(String identifier, CredentialsModel credentials) {

        return switch (credentials.getRole()) {

            case "InternalAuditor" -> InternalAuditor.getGrantedAuthorities();
            case "ExternalAuditor" -> ExternalAuditor.getGrantedAuthorities();
            case "admin" -> admin.getGrantedAuthorities();
            case "Coordinator" -> Coordinator.getGrantedAuthorities();
            default -> throw new NoRoleSpecifiedException(
                    format("User \"%s\" has no role specified", identifier));

        };

    }

    public Optional<CredentialsModel> getByUsername(String username) {
        return credentialsRepository.findCredentialsById(username);
    }

    private static NewCredentialsDTO parseJsonToNewCredentials(String CredentialsJsonString) throws JsonProcessingException {

        ObjectMapper mapper = new ObjectMapper();
        NewCredentialsDTO credentialsDTO = mapper.readValue(CredentialsJsonString, NewCredentialsDTO.class);

        return credentialsDTO;

    }

    @Override
    public String deleteCredentials(String credencialId) {

        credentialsRepository.deleteById(credencialId);

        return "Credentials deleted successfully";
    }

    @Transactional
    public void createNewCredentials(String incomingUserJsonString)
            throws UserAlreadyExistsException, JsonProcessingException {

        NewCredentialsDTO incomingUser = parseJsonToNewCredentials(incomingUserJsonString);
        String username = incomingUser.getUsername();
        String email = incomingUser.getEmail();

        boolean usernameExists = credentialsRepository.findCredentialsById(username).isPresent();
        boolean emailExists = credentialsRepository.findCredentialsById(email).isPresent();

        if (usernameExists || emailExists) {
            throw new UserAlreadyExistsException(format("User \"%s\" already exists", username));
        }

        String hashedPassword = passwordEncoder.encode(incomingUser.getPassword());

        CredentialsLog credenciales = new CredentialsLog(
                hashedPassword,
                true);

        List<CredentialsLog> credentialsLogList = List.of(credenciales);

        CredentialsModel newUser = new CredentialsModel(

                null,
                username,
                email,
                hashedPassword,
                incomingUser.getRole(),
                true,
                true,
                true,
                true,
                incomingUser.getSecurityQuestion(),
                credentialsLogList

        );

        credentialsRepository.save(newUser);

    }

    @Transactional
    public UsersModel createNewUser(String incomingUserJsonString)
            throws UserAlreadyExistsException, JsonProcessingException {

        NewCredentialsDTO incomingUser = parseJsonToNewCredentials(incomingUserJsonString);

        String username = incomingUser.getUsername();

        boolean exists = usersRepository.findUserByUsername(username).isPresent();
        if (exists) {
            throw new UserAlreadyExistsException(format("User \"%s\" already exists", username));
        }

        UsersModel newUser = new UsersModel(

                null,
                incomingUser.getUsername(),
                incomingUser.getName(),
                incomingUser.getEmail(),
                incomingUser.getLanguage(),
                incomingUser.getRole(),
                null
            );

        usersRepository.save(newUser);
        return newUser;

    }

    @Transactional
    public String changeSecurityQuestion(String username, SecurityQuestion newQuestion) throws IllegalArgumentException {

        Pattern regex = Pattern.compile("^[a-zA-ZáéíóúÁÉÍÓÚñÑ¿?\\s]+$");

        if (!regex.matcher(newQuestion.getSecurityQuestion()).matches()) {
            throw new IllegalArgumentException("Security question may only contain letters and spaces.");
        }

        CredentialsModel user = getByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found for updating security question"));

        user.setSecurityQuestion(newQuestion);
        credentialsRepository.save(user);

        return String.format("Security question for user %s updated successfully", username);

    }

    @Transactional
    public String changePassword(NewPasswordDTO incomingData) throws InvalidPasswordSettingsException,
            PasswordAlreadyUsedException,
            ActivePasswordNotFoundException {

        String oldPassword = incomingData.getOldPassword();
        String newPassword = incomingData.getNewPassword();

        if (Strings.isNullOrEmpty(oldPassword) || Strings.isNullOrEmpty(newPassword)) {

            throw new InvalidPasswordSettingsException("Password fields cannot be null or empty");

        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        String username = auth.getName();

        UsersModel usernameToChange = usersRepository.findUserByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Couldn't find user: " + username));

        CredentialsModel retrievedUser = credentialsRepository.findCredentialsById(username)
                .orElseThrow(() -> new UsernameNotFoundException(
                        format("User \"%s\" not found in database! Fatal Error", username)));

        String storedPassword = retrievedUser.getPassword();

        if (!passwordEncoder.matches(oldPassword, storedPassword)) {

            throw new InvalidPasswordSettingsException("Current password does not match with sent password");

        }

        List<CredentialsLog> userCredentialLogs = retrievedUser.getCredentialsLogs();

        for (CredentialsLog c : userCredentialLogs) {

            boolean coincidence = passwordEncoder.matches(newPassword, c.getStoredPassword());

            if (coincidence) {

                throw new PasswordAlreadyUsedException("Intended new password has already been used!");

            }

        }

        CredentialsLog activeCredential = userCredentialLogs
                .stream()
                .filter((credential) -> credential.isActive())
                .findFirst()
                .orElseThrow(() -> new ActivePasswordNotFoundException(format(
                        "User \"%s\" has no active password in their credential logs. Fatal error", username)));

        activeCredential.setActive(false);

        String newHashedPassword = passwordEncoder.encode(newPassword);

        retrievedUser.setPassword(newHashedPassword);

        CredentialsLog newCredentials = new CredentialsLog(

                newHashedPassword,
                true

        );

        userCredentialLogs.add(newCredentials);

        credentialsRepository.save(retrievedUser);
        return "Password changed successfully!";

    }

    public String getSecurityQuestion(String username) {

        CredentialsModel credentialsRetrieved = credentialsRepository.findCredentialsById(username)
                .orElseThrow(() -> new UsernameNotFoundException(
                        format("User \"%s\" not found in database", username)));

        // Get the security question from the retrieved credentials (explicit variable for readability)
        String question = credentialsRetrieved.getSecurityQuestion().getSecurityQuestion();

        return question;

    }

    @Transactional
    public String forgotPasswordRecovery(ForgotPasswordDTO incomingCredentials)
            throws InvalidPasswordSettingsException,
            UsernameNotFoundException,
            InvalidSecretException,
            PasswordAlreadyUsedException,
            ActivePasswordNotFoundException {

        String incomingPassword = incomingCredentials.getNewPassword();
        String username = incomingCredentials.getUsername();
        String securityAnswer = incomingCredentials.getSecurityQuestionAnswer();

        if (Strings.isNullOrEmpty(incomingPassword) || Strings.isNullOrEmpty(username)
                || Strings.isNullOrEmpty(securityAnswer)) {

            throw new InvalidPasswordSettingsException("Fields sent for password recovery cannot be null or empty");

        }

        CredentialsModel retrievedCredentials = credentialsRepository.findCredentialsById(username)
                .orElseThrow(() -> new UsernameNotFoundException(
                        format("User \"%s\" not found in database!", username)));

        String storedAnswerInDB = retrievedCredentials.getSecurityQuestion().getSecurityAnswer();

        if (!storedAnswerInDB.equalsIgnoreCase(securityAnswer)) {

            throw new InvalidSecretException(
                    "Answers sent and stored in database do not match. Please try again!");

        }

        List<CredentialsLog> userCredentialLogs = retrievedCredentials.getCredentialsLogs();

        for (CredentialsLog c : userCredentialLogs) {

            boolean coincidence = passwordEncoder.matches(incomingPassword, c.getStoredPassword());

            if (coincidence) {

                throw new PasswordAlreadyUsedException("Intended new password has already been used!");

            }

        }

        CredentialsLog activeCredential = userCredentialLogs
                .stream()
                .filter((credential) -> credential.isActive())
                .findFirst()
                .orElseThrow(() -> new ActivePasswordNotFoundException(format(
                        "User \"%s\" has no active password in their credential logs. Fatal error", username)));

        activeCredential.setActive(false);

        String hashedPassword = passwordEncoder.encode(incomingPassword);

        retrievedCredentials.setPassword(hashedPassword);

        CredentialsLog nuevosCredenciales = new CredentialsLog(

                hashedPassword,
                true

        );

        userCredentialLogs.add(nuevosCredenciales);

        credentialsRepository.save(retrievedCredentials);

        return "Password changed successfully!";

    }

}

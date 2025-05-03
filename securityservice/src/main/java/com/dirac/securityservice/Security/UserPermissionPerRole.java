package com.dirac.securityservice.Security;

import com.google.common.collect.Sets;
import lombok.Getter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Set;

/**
 * Enum representing user roles and their associated permissions.
 * Each role is associated with a set of granted authorities.
 *
 * @author Jean Paul Delgado Jurado
 * @version 1.0
 * @since 2025-05-02
 */
@Getter
public enum UserPermissionPerRole {

    /**
     * Role representing a user with no specific permissions.
     */
    ExternalAuditor,
    InternalAuditor,
    admin,
    Coordinator;

    /**
     * Returns a set of granted authorities for the role.
     *
     * @return a set of SimpleGrantedAuthority representing the role's permissions
     */
    public Set<SimpleGrantedAuthority> getGrantedAuthorities() {

        Set<SimpleGrantedAuthority> simpleGrantedAuthorities = Sets.newHashSet();

        simpleGrantedAuthorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));

        return simpleGrantedAuthorities;

    }

}

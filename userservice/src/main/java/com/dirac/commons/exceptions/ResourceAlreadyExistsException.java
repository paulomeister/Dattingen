package com.dirac.commons.exceptions;

public class ResourceAlreadyExistsException extends BaseException {
    public ResourceAlreadyExistsException(String resourceName, String field) {
        super(resourceName + " already exists with " + field);
    }
}

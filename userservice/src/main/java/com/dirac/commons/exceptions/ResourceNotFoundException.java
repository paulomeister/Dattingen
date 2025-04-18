package com.dirac.commons.exceptions;

public class ResourceNotFoundException extends BaseException {
    public ResourceNotFoundException(String resourceName, String id) {
        super(resourceName + " not found with id: " + id);
    }
}

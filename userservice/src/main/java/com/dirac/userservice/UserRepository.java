package com.dirac.userservice;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<UserModel, String> {
    // Custom query methods can be defined here if needed

    public UserModel findByEmail(String email);

    public UserModel findByUsername(String username);
    

}

package com.dirac.businessservice.Repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.dirac.businessservice.Model.BusinessModel;

public interface BusinessRepository extends MongoRepository<BusinessModel, String> {
    Optional<BusinessModel> findByBusinessId(String businessId);
}

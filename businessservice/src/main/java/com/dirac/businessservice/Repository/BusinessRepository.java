package com.dirac.businessservice.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.dirac.businessservice.Model.BusinessModel;

public interface BusinessRepository extends MongoRepository<BusinessModel, String> {
    BusinessModel findByBusinessId(String businessId);
}

package com.dirac.auditprocessservice.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.dirac.auditprocessservice.Model.AuditProcessModel;

@Repository
public interface AuditProcessRepository extends MongoRepository<AuditProcessModel, String> {
      @Query(value = "{ 'bussinessId' : ?0, 'rulesetId' : ?1 }")
  AuditProcessModel findByBussinessIdAndRulesetId(String bussinessId, String rulesetId); 
}

package com.dirac.auditprocessservice.Repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.dirac.auditprocessservice.Model.AuditProcessModel;

@Repository
public interface AuditProcessRepository extends MongoRepository<AuditProcessModel, String> {
  @Query(value = "{ 'business' : ?0, 'rulesetId' : ?1 }")
  AuditProcessModel findByBusinessIdAndRulesetId(String businessId, String rulesetId);

  @Query(value = "{ 'businessId' : ?0, 'rulesetId' : ?1 }")
  List<AuditProcessModel> findBybusinessAndRulesetIdAll(String businessId, String rulesetId);
}

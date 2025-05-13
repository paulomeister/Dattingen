package com.dirac.auditprocessservice.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.dirac.auditprocessservice.Model.AuditProcessModel;

public interface AuditRepository extends MongoRepository<AuditProcessModel, String> {
  
}

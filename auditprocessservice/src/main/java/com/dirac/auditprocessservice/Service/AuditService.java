package com.dirac.auditprocessservice.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dirac.auditprocessservice.Model.AuditProcessModel;
import com.dirac.auditprocessservice.Repository.AuditRepository;

@Service
public class AuditService {
  @Autowired
  private AuditRepository auditRepository;

  public void createAuditProcess(AuditProcessModel auditProcess) {
    auditRepository.save(auditProcess);
  }
}

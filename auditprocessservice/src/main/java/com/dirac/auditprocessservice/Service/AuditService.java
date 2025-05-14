package com.dirac.auditprocessservice.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dirac.auditprocessservice.Exceptions.NotFoundException;
import com.dirac.auditprocessservice.Model.AuditProcessModel;
import com.dirac.auditprocessservice.Repository.AuditRepository;

@Service
public class AuditService {
  @Autowired
  private AuditRepository auditRepository;

  public String createAuditProcess(AuditProcessModel auditProcess) {
    try {
      auditRepository.save(auditProcess);
      return "Audit process created successfully";
    } catch (Exception e) {
      return "Error creating audit process: " + e.getMessage();
    }
  }

  public AuditProcessModel getAuditProcess(String bussinessId, String rulesetId) {
      AuditProcessModel auditProcess = auditRepository.findByBussinessIdAndRulesetId(bussinessId, rulesetId);
      if (auditProcess != null) {
        return auditProcess;
      } else {
        throw new NotFoundException("Audit process not found");
      }
  }

  public AuditProcessModel updateAuditProcess(AuditProcessModel audit, String id) {
    AuditProcessModel existing = auditRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("Audit process not found"));

    if (audit.getBussinessId() != null) existing.setBussinessId(audit.getBussinessId());
    if (audit.getRulesetId() != null) existing.setRulesetId(audit.getRulesetId());
    if (audit.getStatus() != null) existing.setStatus(audit.getStatus());
    if (audit.getAssesment() != null) existing.setAssesment(audit.getAssesment());
    if (audit.getAssignedInt() != null) existing.setAssignedInt(audit.getAssignedInt());
    if (audit.getAssignedExt() != null) existing.setAssignedExt(audit.getAssignedExt());
    if (audit.getProcessBegins() != null) existing.setProcessBegins(audit.getProcessBegins());
    if (audit.getProcessEnds() != null) existing.setProcessEnds(audit.getProcessEnds());

    return auditRepository.save(existing);
}

  public String deleteAuditProcess(String id) {
    try {
      auditRepository.deleteById(id);
      return "Audit process deleted successfully";
    } catch (Exception e) {
      return "Error deleting audit process: ";
    }

  }
}

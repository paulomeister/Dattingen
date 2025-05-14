package com.dirac.auditprocessservice.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dirac.auditprocessservice.Model.AuditProcessModel;
import com.dirac.auditprocessservice.Service.AuditService;
import com.dirac.auditprocessservice.DTOs.ResponseDTO;

@RestController
@RequestMapping("/api/")
public class AuditController {
  
  @Autowired
  private AuditService auditService;

  @PostMapping("/create")
  public ResponseEntity<AuditProcessModel> createAuditProcess(@RequestBody AuditProcessModel auditProcess) {
    auditService.createAuditProcess(auditProcess);
    return new ResponseEntity<>(auditProcess, HttpStatus.CREATED);
  }

  @PostMapping("/get/")
  public ResponseDTO<AuditProcessModel> getAuditProcess(@RequestParam String bussinessId, @RequestParam String rulesetId) {
    try {
      AuditProcessModel auditprocess = auditService.getAuditProcess(bussinessId, rulesetId);
    return new ResponseDTO<>(200, "Audit process retrieved successfully", auditprocess);
    } catch (Exception e) {
      return new ResponseDTO<>(404, "Audit process not found", null);
    }
  }

  @PostMapping("/update/{id}")
  public ResponseDTO<AuditProcessModel> updateAuditProcess(@RequestBody AuditProcessModel auditProcess, @RequestParam String id) {
    try {
      AuditProcessModel audit = auditService.updateAuditProcess(auditProcess, id);
      return new ResponseDTO<>(200, "Audit process updated successfully", audit);
    } catch (Exception e) {
      return new ResponseDTO<>(500, "Error updating audit process: " + e.getMessage(), null);
    }
  }

  @PostMapping("/delete")
  public ResponseDTO<String> deleteAuditProcess(@RequestParam String id) {
    auditService.deleteAuditProcess(id);
    return new ResponseDTO<>(200, "Audit process deleted successfully", null);
  }
}

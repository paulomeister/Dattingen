package com.dirac.auditprocessservice.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dirac.auditprocessservice.Model.AuditProcessModel;
import com.dirac.auditprocessservice.Service.AuditProcessService;
import com.dirac.auditprocessservice.DTOs.ResponseDTO;

@RestController
@RequestMapping("/api")
public class AuditController {

  @Autowired
  private AuditProcessService auditProcessService;

  @PostMapping("/get/")
  public ResponseDTO<AuditProcessModel> getAuditProcess(@RequestParam String bussinessId,
      @RequestParam String rulesetId) {
    try {
      AuditProcessModel auditprocess = auditProcessService.getAuditProcess(bussinessId, rulesetId);
      return new ResponseDTO<>(200, "Audit process retrieved successfully", auditprocess);
    } catch (Exception e) {
      return new ResponseDTO<>(404, "Audit process not found", null);
    }
  }

  // Endpoint para Leer Todos (GET)
  @GetMapping("/")
  public ResponseEntity<List<AuditProcessModel>> getAllAuditProcesses() {
    List<AuditProcessModel> auditProcesses = auditProcessService.getAllAuditProcesses();
    return new ResponseEntity<>(auditProcesses, HttpStatus.OK); // 200 OK
  }

  @PostMapping("/create")
  public ResponseEntity<AuditProcessModel> createAuditProcess(@RequestBody AuditProcessModel auditProcess) {
    auditProcessService.createAuditProcess(auditProcess);
    return new ResponseEntity<>(auditProcess, HttpStatus.CREATED);
  }

  @PostMapping("/update/{id}")
  public ResponseDTO<AuditProcessModel> updateAuditProcess(@RequestBody AuditProcessModel auditProcess,
      @RequestParam String id) {
    try {
      AuditProcessModel audit = auditProcessService.updateAuditProcess(id, auditProcess);
      return new ResponseDTO<>(200, "Audit process updated successfully", audit);
    } catch (Exception e) {
      return new ResponseDTO<>(500, "Error updating audit process: " + e.getMessage(), null);
    }
  }

  @PostMapping("/delete")
  public ResponseDTO<String> deleteAuditProcess(@RequestParam String id) {
    auditProcessService.deleteAuditProcess(id);
    return new ResponseDTO<>(200, "Audit process deleted successfully", null);
  }
}

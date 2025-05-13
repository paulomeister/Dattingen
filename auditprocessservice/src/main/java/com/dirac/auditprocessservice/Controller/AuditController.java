package com.dirac.auditprocessservice.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dirac.auditprocessservice.Model.AuditProcessModel;
import com.dirac.auditprocessservice.Service.AuditService;

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

}

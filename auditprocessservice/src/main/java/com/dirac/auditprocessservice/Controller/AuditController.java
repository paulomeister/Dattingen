package com.dirac.auditprocessservice.Controller;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dirac.auditprocessservice.Model.AuditProcessModel;
import com.dirac.auditprocessservice.Model.AuditProcessModel.ProcessStatus;
import com.dirac.auditprocessservice.Model.AuditProcessModel.AssesmentStatus;
import com.dirac.auditprocessservice.Service.AuditProcessService;
import com.dirac.auditprocessservice.DTOs.ResponseDTO;
import com.dirac.auditprocessservice.Exceptions.NotFoundException;

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

  /**
   * Endpoint para asignar un auditor interno a todos los Assesments de un
   * AuditProcess
   */
  @PostMapping("/assignInternalAuditorToAll")
  public ResponseDTO<AuditProcessModel> assignInternalAuditorToAllAssesments(
      @RequestParam String auditProcessId,
      @RequestParam String auditorId,
      @RequestParam String auditorName) {
    try {
      AuditProcessModel updatedProcess = auditProcessService.assignInternalAuditorToAllAssesments(
          auditProcessId, auditorId, auditorName);

      if (updatedProcess == null) {
        return new ResponseDTO<>(404, "Proceso de auditoría no encontrado", null);
      }

      return new ResponseDTO<>(200, "Auditor interno asignado exitosamente a todos los assessments", updatedProcess);
    } catch (Exception e) {
      return new ResponseDTO<>(500, "Error al asignar auditor interno: " + e.getMessage(), null);
    }
  }

  /**
   * Endpoint para asignar un auditor interno a un solo Assesment específico
   */
  @PostMapping("/assignInternalAuditorToAssesment")
  public ResponseDTO<AuditProcessModel> assignInternalAuditorToAssesment(
      @RequestParam String auditProcessId,
      @RequestParam String controlId,
      @RequestParam String auditorId,
      @RequestParam String auditorName) {
    try {
      AuditProcessModel updatedProcess = auditProcessService.assignInternalAuditorToAssesment(
          auditProcessId, controlId, auditorId, auditorName);

      return new ResponseDTO<>(200, "Auditor interno asignado exitosamente al assessment", updatedProcess);
    } catch (NotFoundException e) {
      return new ResponseDTO<>(404, e.getMessage(), null);
    } catch (Exception e) {
      return new ResponseDTO<>(500, "Error al asignar auditor interno: " + e.getMessage(), null);
    }
  }

  /**
   * Endpoint para actualizar el estado de un proceso de auditoría
   */
  @PostMapping("/updateStatus")
  public ResponseDTO<AuditProcessModel> updateAuditProcessStatus(
      @RequestParam String auditProcessId,
      @RequestParam String status) {
    try {
      // Convertir el string de status a enum ProcessStatus
      ProcessStatus processStatus;
      try {
        processStatus = ProcessStatus.valueOf(status);
      } catch (IllegalArgumentException e) {
        return new ResponseDTO<>(400, "Estado inválido. Valores permitidos: " +
            Arrays.toString(ProcessStatus.values()), null);
      }

      AuditProcessModel updatedProcess = auditProcessService.updateAuditProcessStatus(
          auditProcessId, processStatus);

      return new ResponseDTO<>(200, "Estado del proceso de auditoría actualizado exitosamente", updatedProcess);
    } catch (NotFoundException e) {
      return new ResponseDTO<>(404, e.getMessage(), null);
    } catch (Exception e) {
      return new ResponseDTO<>(500, "Error al actualizar el estado del proceso: " + e.getMessage(), null);
    }
  }

  /**
   * Endpoint para actualizar un assessment específico por su controlId
   */
  @PutMapping("/updateAssessment")
  public ResponseDTO<AuditProcessModel> updateAssessment(
      @RequestParam String auditProcessId,
      @RequestParam String controlId,
      @RequestParam(required = false) String status,
      @RequestParam(required = false) String comment) {
    try {
      // Validar que al menos uno de los parámetros opcionales está presente
      if (status == null && comment == null) {
        return new ResponseDTO<>(400, "Se debe proporcionar al menos un valor para actualizar (status o comment)",
            null);
      }

      // Convertir el string de status a enum AssesmentStatus si está presente
      AssesmentStatus assessmentStatus = null;
      if (status != null) {
        try {
          assessmentStatus = AssesmentStatus.valueOf(status);
        } catch (IllegalArgumentException e) {
          return new ResponseDTO<>(400, "Estado inválido. Valores permitidos: " +
              Arrays.toString(AssesmentStatus.values()), null);
        }
      }

      AuditProcessModel updatedProcess = auditProcessService.updateAssesmentByControlId(
          auditProcessId, controlId, assessmentStatus, comment);

      return new ResponseDTO<>(200, "Assessment actualizado exitosamente", updatedProcess);
    } catch (NotFoundException e) {
      return new ResponseDTO<>(404, e.getMessage(), null);
    } catch (Exception e) {
      return new ResponseDTO<>(500, "Error al actualizar el assessment: " + e.getMessage(), null);
    }
  }

}

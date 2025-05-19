package com.dirac.auditprocessservice.Controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
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

  @GetMapping("/")
  public ResponseDTO<List<AuditProcessModel>> getAllAuditProcesses() {
    try {
      List<AuditProcessModel> processes = auditProcessService.getAllAuditProcesses();
      return new ResponseDTO<>(200, "Audit processes found", processes);
    } catch (Exception e) {
      return new ResponseDTO<>(500, "Error fetching processes: " + e.getMessage(), null);
    }
  }

  @GetMapping("/auditProcesses/getAll")
  public ResponseDTO<List<AuditProcessModel>> getByBusinessAndRuleset(
      @RequestParam String businessId,
      @RequestParam String rulesetId) {
    try {
      List<AuditProcessModel> processes = auditProcessService.getAuditProcessesByBusinessId(businessId, rulesetId);
      if (processes == null || processes.isEmpty()) {
        return new ResponseDTO<>(404, "No audit processes found", null);
      }
      return new ResponseDTO<>(200, "Audit processes found", processes);
    } catch (NotFoundException e) {
      return new ResponseDTO<>(404, e.getMessage(), null);
    } catch (Exception e) {
      return new ResponseDTO<>(500, "Error fetching audit processes: " + e.getMessage(), null);
    }
  }

  @GetMapping("/auditProcesses/getLatest")
  public ResponseDTO<AuditProcessModel> getLatestByBusinessAndRuleset(
      @RequestParam String businessId,
      @RequestParam String rulesetId) {
    try {
      AuditProcessModel process = auditProcessService.getLatestAuditProcessByBusinessId(businessId, rulesetId);
      if (process == null) {
        return new ResponseDTO<>(404, "Audit process not found", null);
      }
      return new ResponseDTO<>(200, "Latest audit process found", process);
    } catch (NotFoundException e) {
      return new ResponseDTO<>(404, e.getMessage(), null);
    } catch (Exception e) {
      return new ResponseDTO<>(500, "Error fetching process: " + e.getMessage(), null);
    }
  }

  @GetMapping("/assesments/getAll")
  public ResponseDTO<List<AuditProcessModel.Assesment>> getAssesments(
      @RequestParam String auditProcessId) {
    try {
      List<AuditProcessModel.Assesment> assesments = auditProcessService.getAssesments(auditProcessId);
      return new ResponseDTO<>(200, "Assesments found", assesments);
    } catch (NotFoundException e) {
      return new ResponseDTO<>(404, e.getMessage(), null);
    } catch (Exception e) {
      return new ResponseDTO<>(500, "Error fetching assesments: " + e.getMessage(), null);
    }
  }

  @GetMapping("/assesments/get")
  public ResponseDTO<AuditProcessModel.Assesment> getAssesment(
      @RequestParam String auditProcessId,
      @RequestParam String controlId) {
    try {
      AuditProcessModel.Assesment assesment = auditProcessService.getAssesment(auditProcessId, controlId);
      if (assesment == null) {
        return new ResponseDTO<>(404, "Assesment not found", null);
      }
      return new ResponseDTO<>(200, "Assesment found", assesment);
    } catch (NotFoundException e) {
      return new ResponseDTO<>(404, e.getMessage(), null);
    } catch (Exception e) {
      return new ResponseDTO<>(500, "Error fetching assesment: " + e.getMessage(), null);
    }
  }

  /**
   * Endpoint to check if a userId is assigned as internal or external auditor in
   * any audit process in the database
   */
  @GetMapping("/auditProcesses/isUserAssignedAsAuditor")
  public ResponseDTO<Boolean> isUserAssignedAsAuditor(
      @RequestParam String userId) {
    try {
      boolean assigned = auditProcessService.isUserAssignedAsAuditor(userId);
      return new ResponseDTO<>(200, assigned ? "User is assigned as auditor" : "User is not assigned as auditor",
          assigned);
    } catch (Exception e) {
      return new ResponseDTO<>(500, "Error checking auditor assignment: " + e.getMessage(), null);
    }
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
        return new ResponseDTO<>(404, "Audit process not found", null);
      }

      return new ResponseDTO<>(200, "Internal auditor assigned to all assessments", updatedProcess);
    } catch (Exception e) {
      return new ResponseDTO<>(500, "Error assigning internal auditor: " + e.getMessage(), null);
    }
  }

  /**
   * Endpoint to assign an internal auditor to a single specific assessment
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

      return new ResponseDTO<>(200, "Internal auditor assigned to assessment", updatedProcess);
    } catch (NotFoundException e) {
      return new ResponseDTO<>(404, e.getMessage(), null);
    } catch (Exception e) {
      return new ResponseDTO<>(500, "Error assigning internal auditor: " + e.getMessage(), null);
    }
  }

  /**
   * Endpoint to update an entire AuditProcess by its ID
   */
  @PutMapping("/auditProcesses/update")
  public ResponseDTO<AuditProcessModel> updateAuditProcess(
      @RequestParam String auditProcessId,
      @RequestBody AuditProcessModel updatedAuditProcess) {
    try {
      AuditProcessModel updated = auditProcessService.updateAuditProcess(auditProcessId, updatedAuditProcess);
      if (updated == null) {
        return new ResponseDTO<>(404, "Audit process not found", null);
      }
      return new ResponseDTO<>(200, "Audit process updated", updated);
    } catch (Exception e) {
      return new ResponseDTO<>(500, "Error updating audit process: " + e.getMessage(), null);
    }
  }

  /**
   * Endpoint to update the status of an audit process
   */
  @PutMapping("/auditProcesses/updateStatus")
  public ResponseDTO<AuditProcessModel> updateAuditProcessStatus(
      @RequestParam String auditProcessId,
      @RequestParam ProcessStatus status) {
    try {
      AuditProcessModel updatedProcess = auditProcessService.updateAuditProcessStatus(auditProcessId, status);
      return new ResponseDTO<>(200, "Audit process status updated", updatedProcess);
    } catch (NotFoundException e) {
      return new ResponseDTO<>(404, e.getMessage(), null);
    } catch (Exception e) {
      return new ResponseDTO<>(500, "Error updating process status: " + e.getMessage(), null);
    }
  }

  /**
   * Endpoint to update an assessment by controlId and auditProcessId
   */
  @PutMapping("/assesments/update")
  public ResponseDTO<AuditProcessModel.Assesment> updateAssessment(
      @RequestParam String auditProcessId,
      @RequestParam String controlId,
      @RequestBody(required = false) AssessmentUpdateRequest updateRequest) {
    try {
      if (updateRequest == null || (updateRequest.status == null && updateRequest.comment == null && updateRequest.evidence == null)) {
        return new ResponseDTO<>(400, "At least one value must be provided for update (status, comment, or evidence)", null);
      }
      AssesmentStatus assessmentStatus = null;
      if (updateRequest.status != null) {
        try {
          assessmentStatus = AssesmentStatus.valueOf(updateRequest.status);
        } catch (IllegalArgumentException e) {
          return new ResponseDTO<>(400,
              "Invalid status. Allowed values: " + java.util.Arrays.toString(AssesmentStatus.values()), null);
        }
      }
      AuditProcessModel.Assesment updatedAssesment = auditProcessService.updateAssesmentByControlIdAndReturnAssesment(
          auditProcessId, controlId, assessmentStatus, updateRequest.comment, updateRequest.evidence);
      return new ResponseDTO<>(200, "Assessment updated", updatedAssesment);
    } catch (NotFoundException e) {
      return new ResponseDTO<>(404, e.getMessage(), null);
    } catch (Exception e) {
      return new ResponseDTO<>(500, "Error updating assessment: " + e.getMessage(), null);
    }
  }

  public static class AssessmentUpdateRequest {
    public String status;
    public String comment;
    public AuditProcessModel.Evidence evidence;
  }

  /**
   * Endpoint to update only the status of an assessment by controlId and
   * auditProcessId
   */
  @PutMapping("/assesments/updateStatus")
  public ResponseDTO<AuditProcessModel.Assesment> updateAssessmentStatusOnly(
      @RequestParam String auditProcessId,
      @RequestParam String controlId,
      @RequestParam String status) {
    try {
      AssesmentStatus assessmentStatus;
      try {
        assessmentStatus = AssesmentStatus.valueOf(status);
      } catch (IllegalArgumentException e) {
        return new ResponseDTO<>(400,
            "Invalid status. Allowed values: " + java.util.Arrays.toString(AssesmentStatus.values()), null);
      }
      AuditProcessModel.Assesment updatedAssesment = auditProcessService.updateAssesmentByControlIdAndReturnAssesment(
          auditProcessId, controlId, assessmentStatus, null);
      return new ResponseDTO<>(200, "Assessment status updated", updatedAssesment);
    } catch (NotFoundException e) {
      return new ResponseDTO<>(404, e.getMessage(), null);
    } catch (Exception e) {
      return new ResponseDTO<>(500, "Error updating assessment status: " + e.getMessage(), null);
    }
  }

  /**
   * Endpoint to create a new AuditProcess
   */
  @PostMapping("/auditProcesses/create")
  public ResponseDTO<AuditProcessModel> createAuditProcess(@RequestBody AuditProcessModel auditProcess) {
    try {
      AuditProcessModel created = auditProcessService.createAuditProcess(auditProcess);
      return new ResponseDTO<>(201, "Audit process created", created);
    } catch (IllegalArgumentException e) {
      return new ResponseDTO<>(400, e.getMessage(), null);
    } catch (Exception e) {
      return new ResponseDTO<>(500, "Error creating audit process: " + e.getMessage(), null);
    }
  }

  /**
   * Endpoint to "delete" an AuditProcess by setting its status to CANCELED
   */
  @PutMapping("/auditProcesses/cancel")
  public ResponseDTO<AuditProcessModel> cancelAuditProcess(
      @RequestParam String auditProcessId) {
    try {
      AuditProcessModel updated = auditProcessService.updateAuditProcessStatus(auditProcessId, ProcessStatus.CANCELED);
      if (updated == null) {
        return new ResponseDTO<>(404, "Audit process not found", null);
      }
      return new ResponseDTO<>(200, "Audit process canceled", updated);
    } catch (Exception e) {
      return new ResponseDTO<>(500, "Error canceling audit process: " + e.getMessage(), null);
    }
  }

  /**
   * Endpoint to get an AuditProcess by its ID
   */
  @GetMapping("/auditProcesses/getById")
  public ResponseDTO<AuditProcessModel> getAuditProcessById(@RequestParam String auditProcessId) {
    try {
      Optional<AuditProcessModel> processOpt = auditProcessService.getAuditProcessById(auditProcessId);
      if (processOpt.isPresent()) {
        return new ResponseDTO<>(200, "Audit process found", processOpt.get());
      } else {
        return new ResponseDTO<>(404, "Audit process not found", null);
      }
    } catch (Exception e) {
      return new ResponseDTO<>(500, "Error fetching audit process: " + e.getMessage(), null);
    }
  }

}

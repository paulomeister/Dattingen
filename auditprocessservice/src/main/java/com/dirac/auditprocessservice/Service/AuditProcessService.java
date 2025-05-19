package com.dirac.auditprocessservice.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.dirac.auditprocessservice.DTOs.ResponseDTO;
import com.dirac.auditprocessservice.DTOs.UserDTO;
import com.dirac.auditprocessservice.Exceptions.NotFoundException;
import com.dirac.auditprocessservice.Model.AuditProcessModel;
import com.dirac.auditprocessservice.Model.AuditProcessModel.Assesment;
import com.dirac.auditprocessservice.Model.AuditProcessModel.AssesmentStatus;
import com.dirac.auditprocessservice.Model.AuditProcessModel.Control;
import com.dirac.auditprocessservice.Model.AuditProcessModel.Inspector;
import com.dirac.auditprocessservice.Model.AuditProcessModel.ProcessStatus;
import com.dirac.auditprocessservice.Repository.AuditProcessRepository;

@Service
public class AuditProcessService {
  @Autowired
  private AuditProcessRepository auditProcessRepository;
  @Autowired
  private RestTemplate restTemplate;
  private String apiGatewayUrl = "http://host.docker.internal:8090"; // Cambia esto a la URL de tu API Gateway
  // Read All

  public List<AuditProcessModel> getAllAuditProcesses() {
    return auditProcessRepository.findAll();
  }

  // Read by ID
  public Optional<AuditProcessModel> getAuditProcessById(String id) {
    return auditProcessRepository.findById(id);
  }

  // Returns all Assesments of a Process
  public List<AuditProcessModel.Assesment> getAssesments(String auditProcessId) {
    Optional<AuditProcessModel> auditProcessOptional = auditProcessRepository.findById(auditProcessId);
    if (!auditProcessOptional.isPresent()) {
      throw new NotFoundException("No se encontró el proceso de auditoría con ID: " + auditProcessId);
    }
    AuditProcessModel auditProcess = auditProcessOptional.get();
    if (auditProcess.getAssesments() == null) {
      return new ArrayList<>();
    }
    return auditProcess.getAssesments();
  }

  // Returns ONLY ONE Assesment of a Process
  public AuditProcessModel.Assesment getAssesment(String auditProcessId, String controlId) {
    Optional<AuditProcessModel> auditProcessOptional = auditProcessRepository.findById(auditProcessId);
    if (!auditProcessOptional.isPresent()) {
      throw new NotFoundException("No se encontró el proceso de auditoría con ID: " + auditProcessId);
    }
    AuditProcessModel auditProcess = auditProcessOptional.get();
    if (auditProcess.getAssesments() != null) {
      for (AuditProcessModel.Assesment assesment : auditProcess.getAssesments()) {
        if (assesment.getControlId() != null && assesment.getControlId().equals(controlId)) {
          return assesment;
        }
      }
    }
    throw new NotFoundException("No se encontró un assessment con el controlId: " + controlId);
  }

  public AuditProcessModel getLatestAuditProcessByBusinessId(String businessId, String rulesetId) {
    // Buscar todos los procesos que coincidan con businessId y rulesetId
    List<AuditProcessModel> processes = auditProcessRepository.findBybusinessAndRulesetIdAll(businessId, rulesetId);
    if (processes == null || processes.isEmpty()) {
      throw new NotFoundException("No se encontró ningún proceso de auditoría para ese businessId y rulesetId");
    }
    // Buscar el de fecha más reciente (por startDate)
    return processes.stream()
        .filter(p -> p.getStartDate() != null)
        .max((a, b) -> a.getStartDate().compareTo(b.getStartDate()))
        .orElse(processes.get(0));
  }

  public List<AuditProcessModel> getAuditProcessesByBusinessId(String businessId, String rulesetId) {
    return auditProcessRepository.findBybusinessAndRulesetIdAll(businessId, rulesetId);
  }

  public AuditProcessModel getAuditProcess(String businessId, String rulesetId) {
    AuditProcessModel auditProcess = auditProcessRepository.findByBusinessIdAndRulesetId(businessId, rulesetId);
    if (auditProcess != null) {
      return auditProcess;
    } else {
      throw new NotFoundException("Audit process not found");
    }
  }

  // Método createAuditProcess
  public AuditProcessModel createAuditProcess(AuditProcessModel auditProcess) {
    String rulesetId = auditProcess.getRulesetId();
    String businessId = auditProcess.getBusinessId();

    if (rulesetId == null || rulesetId.isEmpty()) {
      throw new IllegalArgumentException("rulesetId is required");
    }
    if (businessId == null || businessId.isEmpty()) {
      throw new IllegalArgumentException("businessId is required");
    }

    // Step 1: Fetch controls and populate assessments
    List<Control> controls = fetchControlsByRulesetId(rulesetId);
    if (controls == null || controls.isEmpty()) {
      throw new IllegalArgumentException("Could not fetch controls or no controls found for rulesetId " + rulesetId);
    }

    List<Assesment> assesments = new ArrayList<>();
    for (Control control : controls) {
      Assesment assesment = new Assesment();
      assesment.controlId = control.getControlId();
      assesment.status = AssesmentStatus.PENDING;
      assesment.evidence = null;
      assesments.add(assesment);
    }

    // If input model has assessments with evidence, merge them in
    if (auditProcess.getAssesments() != null && !auditProcess.getAssesments().isEmpty()) {
      for (Assesment inputAssesment : auditProcess.getAssesments()) {
        for (Assesment generated : assesments) {
          if (generated.controlId.equals(inputAssesment.controlId) && inputAssesment.evidence != null) {
            generated.evidence = inputAssesment.evidence;
          }
        }
      }
    }

    if (auditProcess.getAssesments() == null) {
      auditProcess.setAssesments(new ArrayList<>());
    }
    auditProcess.getAssesments().addAll(assesments);

    // Step 2: Assign random external auditors
    AuditProcessModel finalAuditProcess = this.assignRandomExternalAuditors(auditProcess);

    // Step 3: Persist the AuditProcessModel
    AuditProcessModel saved = auditProcessRepository.save(finalAuditProcess);

    // Step 4: (Optional) Notify Business Service (not implemented here)
    return saved;
  }

  private List<Control> fetchControlsByRulesetId(String rulesetId) {
    String url = UriComponentsBuilder.fromUriString(apiGatewayUrl) // Usar la URL base inyectada
        .path("/rulesets/api/controls/{rulesetId}")
        .buildAndExpand(rulesetId)
        .toUriString();

    try {
      ResponseEntity<List<Control>> response = restTemplate.exchange(
          url,
          HttpMethod.GET,
          null,
          new ParameterizedTypeReference<List<Control>>() {
          });

      if (response.getStatusCode().is2xxSuccessful()) {
        return response.getBody();
      } else {
        System.err.println("Received non-success status code from rulesets service: " + response.getStatusCode());
        return Collections.emptyList();
      }

    } catch (RestClientException e) {
      System.err.println("Error fetching controls using RestTemplate: " + e.getMessage());
      e.printStackTrace();
      return null; // Indica que la obtención falló
    } catch (Exception e) {
      System.err.println("Unexpected error during control fetch: " + e.getMessage());
      e.printStackTrace();
      return null;
    }
  }

  public AuditProcessModel assignInternalAuditorToAllAssesments(String auditProcessId, String auditorId,
      String auditorName) {
    Optional<AuditProcessModel> auditProcessOptional = auditProcessRepository.findById(auditProcessId);

    if (auditProcessOptional.isPresent()) {
      AuditProcessModel auditProcess = auditProcessOptional.get();

      // Crear el objeto Inspector con los datos proporcionados
      Inspector internalAuditor = new Inspector();
      internalAuditor.set_id(auditorId);
      internalAuditor.setName(auditorName);

      // Asignar el auditor interno a cada assesment
      if (auditProcess.getAssesments() != null) {
        for (Assesment assesment : auditProcess.getAssesments()) {
          assesment.setInternalAuditor(internalAuditor);
        }
      }

      // Si la lista de auditores internos asignados no existe, inicializarla
      if (auditProcess.getAssignedIntAuditors() == null) {
        auditProcess.setAssignedIntAuditors(new ArrayList<>());
      }

      // Verificar si el auditor ya está en la lista para evitar duplicados
      boolean auditorExists = auditProcess.getAssignedIntAuditors().stream()
          .anyMatch(auditor -> auditor.get_id().equals(auditorId));

      if (!auditorExists) {
        auditProcess.getAssignedIntAuditors().add(internalAuditor);
      }

      return auditProcessRepository.save(auditProcess);
    }

    return null;
  }

  public AuditProcessModel assignInternalAuditorToAssesment(String auditProcessId, String controlId, String auditorId,
      String auditorName) {
    Optional<AuditProcessModel> auditProcessOptional = auditProcessRepository.findById(auditProcessId);

    if (auditProcessOptional.isPresent()) {
      AuditProcessModel auditProcess = auditProcessOptional.get();

      // Crear el objeto Inspector con los datos proporcionados
      Inspector internalAuditor = new Inspector();
      internalAuditor.set_id(auditorId);
      internalAuditor.setName(auditorName);

      // Buscar y actualizar solo el assesment específico
      boolean assesmentFound = false;
      if (auditProcess.getAssesments() != null) {
        for (Assesment assesment : auditProcess.getAssesments()) {
          if (assesment.getControlId() != null && assesment.getControlId().equals(controlId)) {
            assesment.setInternalAuditor(internalAuditor);
            assesmentFound = true;
            break;
          }
        }
      }

      if (!assesmentFound) {
        throw new NotFoundException("No se encontró un assessment con el controlId: " + controlId);
      }

      // Si la lista de auditores internos asignados no existe, inicializarla
      if (auditProcess.getAssignedIntAuditors() == null) {
        auditProcess.setAssignedIntAuditors(new ArrayList<>());
      }

      // Verificar si el auditor ya está en la lista para evitar duplicados
      boolean auditorExists = auditProcess.getAssignedIntAuditors().stream()
          .anyMatch(auditor -> auditor.get_id().equals(auditorId));

      if (!auditorExists) {
        auditProcess.getAssignedIntAuditors().add(internalAuditor);
      }

      return auditProcessRepository.save(auditProcess);
    }

    throw new NotFoundException("No se encontró el proceso de auditoría con ID: " + auditProcessId);
  }

  public AuditProcessModel assignRandomExternalAuditors(AuditProcessModel auditProcess) {

    // Construir la URL para el endpoint de usuarios externos aleatorios
    String url = UriComponentsBuilder.fromUriString(apiGatewayUrl)
        .path("/users/api/get/randomExternalAuditors")
        .toUriString();

    try {
      // Realizar la solicitud HTTP GET para obtener auditores externos aleatorios
      ResponseEntity<ResponseDTO<UserDTO>> response = restTemplate.exchange(
          url,
          HttpMethod.GET,
          null,
          new ParameterizedTypeReference<ResponseDTO<UserDTO>>() {
          });
      if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
        @SuppressWarnings("null")
        UserDTO externalAuditor = response.getBody().data;
        Inspector auditor = new Inspector(externalAuditor.get_id(), externalAuditor.getName());

        // Actualizar la lista de auditores externos asignados
        if (auditProcess.getAssignedExtAuditors() == null) {
          auditProcess.setAssignedExtAuditors(new ArrayList<>());
        }

        // Asignar auditores externos a los assesments que no tengan uno asignado
        for (Assesment assesment : auditProcess.getAssesments()) {
          if (assesment.getExternalAuditor() == null) {
            assesment.setExternalAuditor(auditor);
          }
        }

        // Asignarlo a los External Auditors
        auditProcess.getAssignedExtAuditors().add(auditor);

        return auditProcess;
      } else {
        throw new RuntimeException(
            "Error al obtener auditores externos: Respuesta no exitosa del servicio de usuarios");
      }
    } catch (RestClientException e) {
      throw new RuntimeException("Error al contactar el servicio de usuarios: " + e.getMessage(), e);
    }
  }

  public AuditProcessModel updateAuditProcessStatus(String auditProcessId, ProcessStatus status) {
    Optional<AuditProcessModel> auditProcessOptional = auditProcessRepository.findById(auditProcessId);

    if (!auditProcessOptional.isPresent()) {
      throw new NotFoundException("No se encontró el proceso de auditoría con ID: " + auditProcessId);
    }

    AuditProcessModel auditProcess = auditProcessOptional.get();
    auditProcess.setStatus(status);

    // Si el estado es EVALUATED, actualizar la fecha de finalización
    if (status == ProcessStatus.EVALUATED) {
      auditProcess.setEndDate(new Date());
    }

    return auditProcessRepository.save(auditProcess);
  }

  public AuditProcessModel updateAssesmentByControlId(String auditProcessId, String controlId,
      AssesmentStatus status, String comment, AuditProcessModel.Evidence evidence) {
    Optional<AuditProcessModel> auditProcessOptional = auditProcessRepository.findById(auditProcessId);

    if (!auditProcessOptional.isPresent()) {
      throw new NotFoundException("No se encontró el proceso de auditoría con ID: " + auditProcessId);
    }

    AuditProcessModel auditProcess = auditProcessOptional.get();
    boolean assesmentFound = false;

    if (auditProcess.getAssesments() != null) {
      for (Assesment assesment : auditProcess.getAssesments()) {
        if (assesment.getControlId() != null && assesment.getControlId().equals(controlId)) {
          // Actualizar solo los campos proporcionados
          if (status != null) {
            assesment.setStatus(status);
            assesment.setAssesedIn(new Date()); // Registrar la fecha de evaluación
          }

          if (comment != null) {
            assesment.setComment(comment);
          }

          if (evidence != null) {
            assesment.setEvidence(evidence);
          }

          assesmentFound = true;
          break;
        }
      }
    }

    if (!assesmentFound) {
      throw new NotFoundException("No se encontró un assessment con el controlId: " + controlId);
    }

    // Verificar si todos los assessments han sido evaluados para actualizar el
    // estado del proceso
    boolean allAssessed = true;
    if (auditProcess.getAssesments() != null) {
      for (Assesment assesment : auditProcess.getAssesments()) {
        if (assesment.getStatus() == AssesmentStatus.PENDING) {
          allAssessed = false;
          break;
        }
      }

      // Si todos han sido evaluados, actualizar el estado del proceso
      if (allAssessed && auditProcess.getStatus() != ProcessStatus.EVALUATED) {
        auditProcess.setStatus(ProcessStatus.EVALUATED);
        auditProcess.setEndDate(new Date());
      }
    }

    return auditProcessRepository.save(auditProcess);
  }

  public AuditProcessModel.Assesment updateAssesmentByControlIdAndReturnAssesment(String auditProcessId,
      String controlId,
      AssesmentStatus status, String comment, AuditProcessModel.Evidence evidence) {
    Optional<AuditProcessModel> auditProcessOptional = auditProcessRepository.findById(auditProcessId);
    if (!auditProcessOptional.isPresent()) {
      throw new NotFoundException("Audit process not found with ID: " + auditProcessId);
    }
    AuditProcessModel auditProcess = auditProcessOptional.get();
    if (auditProcess.getAssesments() != null) {
      for (AuditProcessModel.Assesment assesment : auditProcess.getAssesments()) {
        if (assesment.getControlId() != null && assesment.getControlId().equals(controlId)) {
          if (status != null) {
            assesment.setStatus(status);
            assesment.setAssesedIn(new java.util.Date());
          }
          if (comment != null) {
            assesment.setComment(comment);
          }
          if (evidence != null) {
            assesment.setEvidence(evidence);
          }
          auditProcessRepository.save(auditProcess);
          return assesment;
        }
      }
    }
    throw new NotFoundException("Assessment not found with controlId: " + controlId);
  }

  // Overload for backward compatibility
  public AuditProcessModel.Assesment updateAssesmentByControlIdAndReturnAssesment(String auditProcessId,
      String controlId,
      AssesmentStatus status, String comment) {
    return updateAssesmentByControlIdAndReturnAssesment(auditProcessId, controlId, status, comment, null);
  }

  public AuditProcessModel updateAssesmentByControlId(String auditProcessId, String controlId,
      AssesmentStatus status, String comment) {
    return updateAssesmentByControlId(auditProcessId, controlId, status, comment, null);
  }

  // Update,
  // !WE HAVE TO SEND ALL THE OBJECT
  public AuditProcessModel updateAuditProcess(String id, AuditProcessModel updatedAuditProcess) {
    Optional<AuditProcessModel> existingProcessOptional = auditProcessRepository.findById(id);

    if (existingProcessOptional.isPresent()) {
      AuditProcessModel existingProcess = existingProcessOptional.get();

      updatedAuditProcess.set_id(existingProcess.get_id());
      return auditProcessRepository.save(updatedAuditProcess);
    } else {
      return null;
    }
  }

  public String deleteAuditProcess(String id) {
    try {
      auditProcessRepository.deleteById(id);
      return "Audit process deleted successfully";
    } catch (Exception e) {
      return "Error deleting audit process: " + e.getMessage();
    }

  }

  /**
   * Checks if a userId is present in assignedIntAuditors or assignedExtAuditors for any audit process in the database.
   * @param userId the user to check
   * @return true if found, false otherwise
   */
  public boolean isUserAssignedAsAuditor(String userId) {
      List<AuditProcessModel> processes = auditProcessRepository.findAll();
      for (AuditProcessModel process : processes) {
          if (process.getAssignedIntAuditors() != null &&
              process.getAssignedIntAuditors().stream().anyMatch(aud -> userId.equals(aud.get_id()))) {
              return true;
          }
          if (process.getAssignedExtAuditors() != null &&
              process.getAssignedExtAuditors().stream().anyMatch(aud -> userId.equals(aud.get_id()))) {
              return true;
          }
      }
      return false;
  }
}

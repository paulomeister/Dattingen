package com.dirac.auditprocessservice.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.dirac.auditprocessservice.DTOs.BusinessAuditDTO;
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

  // Método createAuditProcess
  public String createAuditProcess(AuditProcessModel auditProcess) {
    String rulesetId = auditProcess.getRulesetId();
    String businessId = auditProcess.getBusinessId();

    if (rulesetId == null || rulesetId.isEmpty()) {
      return "Error creating audit process: rulesetId is missing.";
    }
    if (businessId == null || businessId.isEmpty()) { // También validamos businessId
      return "Error creating audit process: businessId is missing.";
    }

    AuditProcessModel savedAuditProcess = null;

    try {
      // Paso 1: Obtener controles y poblar los assesments
      List<Control> controls = fetchControlsByRulesetId(rulesetId);

      if (controls == null || controls.isEmpty()) {
        return "Error creating audit process: Could not fetch controls or no controls found for rulesetId " + rulesetId;
      }

      List<Assesment> assesments = new ArrayList<>();
      for (Control control : controls) {
        Assesment assesment = new Assesment();
        assesment.controlId = control.getControlId();
        assesment.status = AssesmentStatus.NOT_EVALUATED;
        assesments.add(assesment);
      }

      if (auditProcess.getAssesment() == null) {
        auditProcess.setAssesment(new ArrayList<>());
      }
      auditProcess.getAssesment().addAll(assesments);
      // Paso 2: Llamar al Servicio para asignar un External Auditor de manera
      // Aleatoria
      AuditProcessModel finalAuditProcess = this.assignRandomExternalAuditors(auditProcess);

      // Paso 3: Guardar el AuditProcessModel en bd
      savedAuditProcess = auditProcessRepository.save(finalAuditProcess);

      // Paso 4: Llamar al Business Service para actualizar el objeto Business

      // Preparamos los datos que espera el Business Service en su AuditModel
      BusinessAuditDTO businessAuditData = new BusinessAuditDTO(
          savedAuditProcess.getRulesetId(), // rulesetId
          savedAuditProcess.getStartDate(), // startDate del proceso guardado
          savedAuditProcess.getEndDate(), // endDate del proceso guardado
          savedAuditProcess.getStatus() != null ? savedAuditProcess.getStatus().name() : null // Convertir enum a String
      );

      // Llamamos al método auxiliar para hacer la petición POST al Business Service
      updateBusinessWithNewAudit(businessId, businessAuditData);

      return "Audit process created successfully with " + assesments.size()
          + " assesments. Business update notification sent.";

    } catch (Exception e) {
      System.err.println("Error during audit process creation or initial save: " + e.getMessage());
      e.printStackTrace();
      return "Error creating audit process: " + e.getMessage();
    }
  }

  private void updateBusinessWithNewAudit(String businessId, BusinessAuditDTO auditData) {
    // Construimos la URL usando la URL base inyectada
    String url = UriComponentsBuilder.fromUriString(apiGatewayUrl)
        .path("/businesses/api/{businessId}/newAudit")
        .buildAndExpand(businessId)
        .toUriString();

    try {
      HttpHeaders headers = new HttpHeaders();
      headers.setContentType(MediaType.APPLICATION_JSON);

      // Creamos la entidad HTTP con el cuerpo (el DTO) y los headers
      HttpEntity<BusinessAuditDTO> requestEntity = new HttpEntity<BusinessAuditDTO>(auditData, headers);
      restTemplate.exchange(url, HttpMethod.POST, requestEntity, Void.class);
      System.out.println("Successfully notified Business Service for businessId: " + businessId);

    } catch (RestClientException e) {
      // Capturamos errores de la llamada HTTP (conexión, 4xx, 5xx)
      System.err.println(
          "Error calling Business Service to add new audit for businessId " + businessId + ": " + e.getMessage());
      e.printStackTrace();
    } catch (Exception e) {
      System.err
          .println("Unexpected error calling Business Service for businessId " + businessId + ": " + e.getMessage());
      e.printStackTrace();
    }
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

  public AuditProcessModel getAuditProcess(String bussinessId, String rulesetId) {
    AuditProcessModel auditProcess = auditProcessRepository.findByBussinessIdAndRulesetId(bussinessId, rulesetId);
    if (auditProcess != null) {
      return auditProcess;
    } else {
      throw new NotFoundException("Audit process not found");
    }
  }

  // Read All
  public List<AuditProcessModel> getAllAuditProcesses() {
    return auditProcessRepository.findAll();
  }

  // Read by ID
  public Optional<AuditProcessModel> getAuditProcessById(String id) {
    return auditProcessRepository.findById(id);
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
      return "Error deleting audit process: ";
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
      if (auditProcess.getAssesment() != null) {
        for (Assesment assesment : auditProcess.getAssesment()) {
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
      if (auditProcess.getAssesment() != null) {
        for (Assesment assesment : auditProcess.getAssesment()) {
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
        .path("/users/api/getRandomExternalAuditors")
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
        for (Assesment assesment : auditProcess.getAssesment()) {
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
      AssesmentStatus status, String comment) {
    Optional<AuditProcessModel> auditProcessOptional = auditProcessRepository.findById(auditProcessId);

    if (!auditProcessOptional.isPresent()) {
      throw new NotFoundException("No se encontró el proceso de auditoría con ID: " + auditProcessId);
    }

    AuditProcessModel auditProcess = auditProcessOptional.get();
    boolean assesmentFound = false;

    if (auditProcess.getAssesment() != null) {
      for (Assesment assesment : auditProcess.getAssesment()) {
        if (assesment.getControlId() != null && assesment.getControlId().equals(controlId)) {
          // Actualizar solo los campos proporcionados
          if (status != null) {
            assesment.setStatus(status);
            assesment.setAssesedIn(new Date()); // Registrar la fecha de evaluación
          }

          if (comment != null) {
            assesment.setComment(comment);
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
    if (auditProcess.getAssesment() != null) {
      for (Assesment assesment : auditProcess.getAssesment()) {
        if (assesment.getStatus() == AssesmentStatus.NOT_EVALUATED) {
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
}

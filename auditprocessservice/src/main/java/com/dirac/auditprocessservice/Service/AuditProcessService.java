package com.dirac.auditprocessservice.Service;

import java.util.ArrayList;
import java.util.Collections;
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
import com.dirac.auditprocessservice.Exceptions.NotFoundException;
import com.dirac.auditprocessservice.Model.AuditProcessModel;
import com.dirac.auditprocessservice.Model.AuditProcessModel.Assesment;
import com.dirac.auditprocessservice.Model.AuditProcessModel.AssesmentStatus;
import com.dirac.auditprocessservice.Model.AuditProcessModel.Control;
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
    String businessId = auditProcess.getBusinessId(); // Asegúrate de que tu modelo tenga getBusinessId
    if (rulesetId == null || rulesetId.isEmpty()) {
      return "Error creating audit process: rulesetId is missing.";
    }
    if (businessId == null || businessId.isEmpty()) { // También validamos businessId
      return "Error creating audit process: businessId is missing.";
    }

    AuditProcessModel savedAuditProcess = null; // Para tener el objeto guardado si falla la 2da llamada

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

      // Paso 2: Guardar el AuditProcessModel en tu base de datos (MongoDB)
      savedAuditProcess = auditProcessRepository.save(auditProcess); // Capturamos el resultado del save

      // Paso 3: Llamar al Business Service para actualizar el objeto Business
      // Esto se hace DESPUÉS de haber guardado exitosamente el AuditProcess

      // Preparamos los datos que espera el Business Service en su AuditModel
      BusinessAuditDTO businessAuditData = new BusinessAuditDTO(
          savedAuditProcess.getRulesetId(), // rulesetId
          savedAuditProcess.getStartDate(), // startDate del proceso guardado
          savedAuditProcess.getEndDate(), // endDate del proceso guardado
          savedAuditProcess.getStatus() != null ? savedAuditProcess.getStatus().name() : null // Convertir enum a String
      );

      // Llamamos al método auxiliar para hacer la petición POST al Business Service
      updateBusinessWithNewAudit(businessId, businessAuditData);

      // Si llegamos aquí, el proceso se guardó en BD y se intentó notificar al
      // servicio de negocios
      return "Audit process created successfully with " + assesments.size()
          + " assesments. Business update notification sent.";

    } catch (Exception e) {
      // Este catch manejará errores de la obtención de controles o del guardado en
      // BD.
      // Los errores de la 2da llamada HTTP se capturan en el método auxiliar
      // updateBusinessWithNewAudit
      System.err.println("Error during audit process creation or initial save: " + e.getMessage());
      e.printStackTrace();
      // Puedes añadir lógica para limpiar si el savedAuditProcess no es null pero
      // falló la 2da llamada,
      // pero eso implica transacciones distribuidas y es más complejo. Por ahora,
      // solo logeamos el error de la 2da llamada.
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
      System.err.println("Unexpected error calling Business Service for businessId " + businessId + ": " + e.getMessage());
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
}

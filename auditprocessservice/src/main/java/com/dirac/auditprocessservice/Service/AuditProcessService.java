package com.dirac.auditprocessservice.Service;

import java.util.ArrayList;
import java.util.Collections;
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
  private String API_GATEWAY_URL = "http://host.docker.internal:8090"; // Cambia esto a la URL de tu API Gateway

  // Método createAuditProcess
  public String createAuditProcess(AuditProcessModel auditProcess) {
    String rulesetId = auditProcess.getRulesetId();
    if (rulesetId == null || rulesetId.isEmpty()) {
      return "Error creating audit process: rulesetId is missing.";
    }

    try {
      // 1. Mandar la petición para obtener la lista de controles (que tienen el
      // controlId)
      List<Control> controls = fetchControlsByRulesetId(rulesetId);

      // Verificar si se obtuvieron controles
      if (controls == null || controls.isEmpty()) {
        return "Error creating audit process: Could not fetch controls or no controls found for rulesetId " + rulesetId;
      }

      // 2. Crear la lista de Assesments basándonos en los controles obtenidos
      List<Assesment> assesments = new ArrayList<>();
      for (Control control : controls) {
        Assesment assesment = new Assesment();
        // *** Aquí es donde usamos el controlId del Control obtenido para crear el Assesment ***
        assesment.controlId = control.getControlId();
        assesment.status = AssesmentStatus.NOT_EVALUATED; // Establecer estado inicial
        // Los demás campos de Assesment se dejan como null o valores por defecto
        assesments.add(assesment);
      }

      // Asignar la lista de assesments al proceso de auditoría
      if (auditProcess.getAssesment() == null) {
        auditProcess.setAssesment(new ArrayList<>());
      }
      auditProcess.getAssesment().addAll(assesments);

      // 3. Guardar el proceso de auditoría modificado
      auditProcessRepository.save(auditProcess);

      return "Audit process created successfully with " + assesments.size() + " assesments.";

    } catch (Exception e) {
      System.err.println("Error creating audit process: " + e.getMessage());
      e.printStackTrace();
      return "Error creating audit process: " + e.getMessage();
    }
  }

  // Método auxiliar para llamar al servicio de rulesets usando RestTemplate
  private List<Control> fetchControlsByRulesetId(String rulesetId) {
    String url = UriComponentsBuilder.fromUriString(API_GATEWAY_URL)
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

package com.dirac.auditprocessservice.Model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "AuditsProcesses")
public class AuditProcessModel {

  @Id
  private String _id;

  private String businessId; //
  private String rulesetId; //
  private ProcessStatus status; // Evaluated or not
  private List<Inspector> assignedIntAuditors;
  private List<Inspector> assignedExtAuditors;

  private List<Assesment> assesment;

  private Date startDate;
  private Date endDate;

  @Data
  @AllArgsConstructor
  @NoArgsConstructor
  public static class Inspector {
    private String _id;
    private String name;
  }

  @Data
  @AllArgsConstructor
  @NoArgsConstructor
  public static class Assesment {
    public String controlId; // SE manda a un endpoint getControl(controlId, rulesetId) para obtener el
                             // control
    public AssesmentStatus status;
    public Date assesedIn;
    public Inspector internalAuditor;
    public Inspector externalAuditor;
    public String comment;
  }

  @Data
  public static class Evidence {
    private String description;
    private String url;
    private Date addedDate; // Fecha en que se añadió la evidencia

  }

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  public static class Control {
    private String controlId;
    private String title;
    private String description;
    private String suitability;
    private PHVAPhase cycleStage;
    private ComplianceLevel compulsoriness;
  }

  public enum ProcessStatus {
    NOT_EVALUATED,
    EVALUATED,
    CANCELED
  }

  public enum AssesmentStatus {
    PENDING,
    COMPLIANT,
    NON_COMPLIANT,
    NOT_DONE // Es un estado para cuando el auditor interno diga que no tiene ese criterio
             // implmentado
  }

  public enum PHVAPhase {
    PLAN,
    DO,
    CHECK,
    ACT
  }

  public enum ComplianceLevel {
    SHALL("deberá"),
    MUST("debe"),
    SHOULD("podrá"),
    MAY("puede");

    private final String spanishTerm;

    ComplianceLevel(String spanishTerm) {
      this.spanishTerm = spanishTerm;
    }

    public String getSpanishTerm() {
      return spanishTerm;
    }

    public static List<String> getAllInEnglish() {
      List<String> englishTerms = new ArrayList<>();
      for (ComplianceLevel level : ComplianceLevel.values()) {
        englishTerms.add(level.name()); // `name()` retorna el valor en inglés
      }
      return englishTerms;
    }

    public static List<String> getAllInSpanish() {
      List<String> spanishTerms = new ArrayList<>();
      for (ComplianceLevel level : ComplianceLevel.values()) {
        spanishTerms.add(level.getSpanishTerm()); // Usar `getSpanishTerm()` para obtener el valor en español
      }
      return spanishTerms;
    }
  }

}

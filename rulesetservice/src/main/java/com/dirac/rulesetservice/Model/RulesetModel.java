package com.dirac.rulesetservice.Model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "Rulesets")
public class RulesetModel {


  @Id
  private String _id;
  private String version;
  private String name;
  private String organization;
  private Date publishingDate;
  private String status;
  private List<Control> controls;

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

  public enum PHVAPhase {
      PLAN,
      DO,
      CHECK,
      ACT
  }

  public enum ComplianceLevel {
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
  }


}

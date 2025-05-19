package com.dirac.businessservice.Model;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuditModel {
  private String rulesetId;
  private String name;
  private String status;
  private LocalDate startDate;
  private LocalDate endDate;
}

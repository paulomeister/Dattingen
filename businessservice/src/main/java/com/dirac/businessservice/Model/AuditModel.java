package com.dirac.businessservice.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuditModel {
  private String _id;
  private String name;
  private String rulesetId;
  private String startDate;
  private String endDate;
  private String status;
  private Integer processCount;
}

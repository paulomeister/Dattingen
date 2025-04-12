package com.dirac.businessservice.Model;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuditModel {
  private String rulesetId;
  private Date startDate;
  private Date endDate;
  private String status;
}

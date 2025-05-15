package com.dirac.auditprocessservice.DTOs;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Lombok annotations
@AllArgsConstructor
@NoArgsConstructor
public class BusinessAuditDTO {
    private String rulesetId;
    private Date startDate;
    private Date endDate;
    private String status; // Mapeará el enum ProcessStatus a String
}
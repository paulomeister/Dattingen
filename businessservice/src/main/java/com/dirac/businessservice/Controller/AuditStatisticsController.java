package com.dirac.businessservice.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.dirac.businessservice.DTOs.AuditStatisticsDTO;
import com.dirac.businessservice.DTOs.ResponseDTO;
import com.dirac.businessservice.Service.AuditStatisticsService;

@RestController
@RequestMapping("/api/statistics/audits")
public class AuditStatisticsController {

    @Autowired
    private AuditStatisticsService auditStatisticsService;

    @GetMapping("/{businessId}/{rulesetId}")
    public ResponseEntity<ResponseDTO<AuditStatisticsDTO>> getAuditStatisticsByBusinessAndRuleset(
            @PathVariable String businessId, @PathVariable String rulesetId) {
        AuditStatisticsDTO auditStats = auditStatisticsService.getCompleteAuditStatistics(businessId, rulesetId);
        return ResponseEntity.ok(new ResponseDTO<>(200, "Audit statistics retrieved successfully.", auditStats));
    }

}

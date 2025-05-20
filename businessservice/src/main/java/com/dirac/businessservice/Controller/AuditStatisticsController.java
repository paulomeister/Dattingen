package com.dirac.businessservice.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.dirac.businessservice.DTOs.AuditStatisticsResponseDTO;
import com.dirac.businessservice.DTOs.ResponseDTO;
import com.dirac.businessservice.Service.AuditStatisticsService;

@RestController
@RequestMapping("/api/statistics/audits")
public class AuditStatisticsController {    
    @Autowired
    private AuditStatisticsService auditStatisticsService;

    @GetMapping("/{businessId}")
    public ResponseEntity<ResponseDTO<?>> getAuditStatisticsByBusiness(
            @PathVariable String businessId) {
        // AuditStatisticsResponseDTO auditStats = auditStatisticsService.getFormattedAuditStatistics(businessId);
        return ResponseEntity.ok(new ResponseDTO<String>(200, "Audit statistics retrieved successfully.", ""));
    }

}

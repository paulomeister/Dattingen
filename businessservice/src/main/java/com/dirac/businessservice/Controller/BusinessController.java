package com.dirac.businessservice.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.dirac.businessservice.DTOs.AuditStatisticsDTO;
import com.dirac.businessservice.DTOs.ResponseDTO;
import com.dirac.businessservice.Model.AsociateModel;
import com.dirac.businessservice.Model.AuditModel;
import com.dirac.businessservice.Model.BusinessModel;
import com.dirac.businessservice.Service.AuditStatisticsService;
import com.dirac.businessservice.Service.BusinessService;

import java.util.List;

@RestController
@RequestMapping("/api")
public class BusinessController {

    @Autowired
    private BusinessService businessService;
    
    @Autowired
    private AuditStatisticsService auditStatisticsService;

    @GetMapping("/")
    public ResponseEntity<ResponseDTO<List<BusinessModel>>> getAllBusinesses() {
        List<BusinessModel> businesses = businessService.findAllBusinesses();
        return ResponseEntity.ok(new ResponseDTO<>(200, "Top 20 businesses retrieved successfully.", businesses));
    }

    @GetMapping("/{businessId}")
    public ResponseEntity<ResponseDTO<BusinessModel>> getBusinessById(@PathVariable String businessId) {
        BusinessModel business = businessService.getBusinessById(businessId);
        return ResponseEntity.ok(new ResponseDTO<>(200, "Business retrieved successfully.", business));
    }

    @PostMapping
    public ResponseEntity<ResponseDTO<BusinessModel>> saveBusiness(@RequestBody BusinessModel businessModel) {
        BusinessModel savedBusiness = businessService.saveBusiness(businessModel);
        return ResponseEntity.status(201).body(new ResponseDTO<>(201, "Business created successfully.", savedBusiness));
    }

    @PutMapping("/{businessId}")
    public ResponseEntity<ResponseDTO<BusinessModel>> updateBusiness(@PathVariable String businessId,
            @RequestBody BusinessModel businessModel) {
        BusinessModel updatedBusiness = businessService.updateBusiness(businessId, businessModel);
        return ResponseEntity.ok(new ResponseDTO<>(200, "Business updated successfully.", updatedBusiness));
    }

    @PostMapping("/{businessId}/newAudit")
    public ResponseEntity<ResponseDTO<String>> createAuditProcess(@PathVariable String businessId,
            @RequestBody AuditModel auditModel) {
        String auditProcessId = businessService.addAudit(businessId, auditModel);
        return ResponseEntity.status(201)
                .body(new ResponseDTO<>(201, "Audit process created successfully.", auditProcessId));
    }
    
    @DeleteMapping("/{businessId}")
    public ResponseEntity<ResponseDTO<String>> deleteBusiness(@PathVariable String businessId) {
        businessService.deleteBusiness(businessId);
        return ResponseEntity.ok(new ResponseDTO<>(200, "Business deleted successfully.", businessId));
    }
    
    /**
     * Endpoint para obtener estadísticas completas de auditoría para una empresa y un ruleset
     * 
     * @param businessId ID del negocio
     * @param rulesetId ID del conjunto de reglas
     * @return Estadísticas completas de auditoría
     */
    @GetMapping("/{businessId}/statistics/{rulesetId}")
    public ResponseEntity<ResponseDTO<AuditStatisticsDTO>> getCompleteAuditStatistics(
            @PathVariable String businessId, 
            @PathVariable String rulesetId) {
        
        AuditStatisticsDTO statistics = auditStatisticsService.getCompleteAuditStatistics(businessId, rulesetId);
        
        return ResponseEntity.ok(new ResponseDTO<>(
            200, 
            "Complete audit statistics retrieved successfully.", 
            statistics
        ));
    }

    @GetMapping("/search")
    public ResponseEntity<ResponseDTO<List<BusinessModel>>> searchBusinesses(
            @RequestParam(required = false) String name) {
        List<BusinessModel> businesses = businessService.findBusinessesByName(name);
        return ResponseEntity.ok(new ResponseDTO<>(200, "Businesses retrieved successfully.", businesses));
    }

    @PostMapping("/business/registerAuditors/{businessId}")
    public ResponseEntity<ResponseDTO<BusinessModel>> registerAuditors(@PathVariable String businessId, 
            @RequestBody List<AsociateModel> associates) {
        BusinessModel updatedBusiness = businessService.registerAuditors(businessId, associates);
        return ResponseEntity.ok(new ResponseDTO<>(200, "Auditors registered successfully.", updatedBusiness));
    }
}

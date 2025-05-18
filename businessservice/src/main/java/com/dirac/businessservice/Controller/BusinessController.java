package com.dirac.businessservice.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.dirac.businessservice.DTOs.ResponseDTO;
import com.dirac.businessservice.Model.BusinessModel;
import com.dirac.businessservice.Service.AuditStatisticsService;
import com.dirac.businessservice.Service.BusinessService;

import lombok.extern.slf4j.Slf4j;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api")
public class BusinessController {

    @Autowired
    private BusinessService businessService;

    @Autowired
    private AuditStatisticsService auditStatisticsService;

    @GetMapping("/")
    public ResponseEntity<ResponseDTO<List<BusinessModel>>> getAllBusinesses() {
        log.info("Fetching all businesses");
        List<BusinessModel> businesses = businessService.findAllBusinesses();
        log.info("Retrieved {} businesses", businesses.size());
        return ResponseEntity.ok(new ResponseDTO<>(200, "Top 20 businesses retrieved successfully.", businesses));
    }

    @GetMapping("/{businessId}")
    public ResponseEntity<ResponseDTO<BusinessModel>> getBusinessById(@PathVariable String businessId) {
        log.info("Fetching business with ID: {}", businessId);
        BusinessModel business = businessService.getBusinessById(businessId);
        if (business != null) {
            log.info("Business found: {}", businessId);
        } else {
            log.warn("Business not found: {}", businessId);
        }
        return ResponseEntity.ok(new ResponseDTO<>(200, "Business retrieved successfully.", business));
    }

    @PostMapping("/saveBusiness")
    @PreAuthorize("hasAnyRole('admin', 'Coordinator')")
    public ResponseEntity<ResponseDTO<BusinessModel>> saveBusiness(@RequestBody BusinessModel businessModel) {
        log.info("Creating new business: {}", businessModel.getName());
        BusinessModel savedBusiness = businessService.saveBusiness(businessModel);
        log.info("Business created with ID: {}", savedBusiness.get_id());
        return ResponseEntity.status(201).body(new ResponseDTO<>(201, "Business created successfully.", savedBusiness));
    }

    @PutMapping("/{businessId}")
    @PreAuthorize("hasAnyRole('admin', 'Coordinator')")

    public ResponseEntity<ResponseDTO<BusinessModel>> updateBusiness(@PathVariable String businessId,
            @RequestBody BusinessModel businessModel) {
        log.info("Updating business with ID: {}", businessId);
        BusinessModel updatedBusiness = businessService.updateBusiness(businessId, businessModel);
        log.info("Business updated: {}", businessId);
        return ResponseEntity.ok(new ResponseDTO<>(200, "Business updated successfully.", updatedBusiness));
    }

    @DeleteMapping("/{businessId}")
    @PreAuthorize("hasAnyRole('admin', 'Coordinator')")
    public ResponseEntity<ResponseDTO<String>> deleteBusiness(@PathVariable String businessId) {
        log.info("Deleting business with ID: {}", businessId);
        businessService.deleteBusiness(businessId);
        log.info("Business deleted: {}", businessId);
        return ResponseEntity.ok(new ResponseDTO<>(200, "Business deleted successfully.", businessId));
    }

    @GetMapping("/search")
    public ResponseEntity<ResponseDTO<List<BusinessModel>>> searchBusinesses(
            @RequestParam(required = false) String name) {
        log.info("Searching businesses by name: {}", name);
        List<BusinessModel> businesses = businessService.findBusinessesByName(name);
        log.info("Found {} businesses for search term '{}'", businesses.size(), name);
        return ResponseEntity.ok(new ResponseDTO<>(200, "Businesses retrieved successfully.", businesses));
    }
}

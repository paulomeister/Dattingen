package com.dirac.businessservice.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.dirac.businessservice.Model.BusinessModel;
import com.dirac.businessservice.Service.BusinessService;

@RestController
@RequestMapping("/api/business")
public class BusinessController {

    @Autowired
    private BusinessService businessService;

    // Endpoint to get a business by its ID
    @GetMapping("/{businessId}")
    public ResponseEntity<?> getBusinessById(@PathVariable String businessId) {
        BusinessModel business = businessService.getBusinessById(businessId);
        if (business != null) {
            return ResponseEntity.ok(business);
        } else {
            return ResponseEntity.status(404).body("Business with businessId " + businessId + " not found.");
        }
    }

    // Endpoint to save a new business
    @PostMapping
    public ResponseEntity<BusinessModel> saveBusiness(@RequestBody BusinessModel businessModel) {
        BusinessModel savedBusiness = businessService.saveBusiness(businessModel);
        return ResponseEntity.status(201).body(savedBusiness);
    }

    // Endpoint to update an existing business
    @PutMapping("/{businessId}")
    public ResponseEntity<?> updateBusiness(@PathVariable String businessId, @RequestBody BusinessModel businessModel) {
        try {
            BusinessModel updatedBusiness = businessService.updateBusiness(businessId, businessModel);
            return ResponseEntity.ok(updatedBusiness);
        } catch (Exception e) {
            return ResponseEntity.status(404).body("Business with businessId " + businessId + " not found.");
        }
    }

    // Endpoint to delete a business by its ID
    @DeleteMapping("/{businessId}")
    public ResponseEntity<?> deleteBusiness(@PathVariable String businessId) {
        try {
            businessService.deleteBusiness(businessId);
            return ResponseEntity.ok("Business with businessId " + businessId + " has been deleted.");
        } catch (Exception e) {
            return ResponseEntity.status(404).body("Business with businessId " + businessId + " not found.");
        }
    }
}

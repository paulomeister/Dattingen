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

    // Endpoint para obtener un negocio por su ID
    @GetMapping("/{businessId}")
    public ResponseEntity<BusinessModel> getBusinessById(@PathVariable String businessId) {
        BusinessModel business = businessService.getBusinessById(businessId);
        return ResponseEntity.ok(business);
    }

    // Endpoint para guardar un nuevo negocio
    @PostMapping
    public ResponseEntity<BusinessModel> saveBusiness(@RequestBody BusinessModel businessModel) {
        BusinessModel savedBusiness = businessService.saveBusiness(businessModel);
        return ResponseEntity.status(201).body(savedBusiness);
    }

    // Endpoint para actualizar un negocio existente
    @PutMapping("/{businessId}")
    public ResponseEntity<BusinessModel> updateBusiness(@PathVariable String businessId, @RequestBody BusinessModel businessModel) {
        BusinessModel updatedBusiness = businessService.updateBusiness(businessId, businessModel);
        return ResponseEntity.ok(updatedBusiness);
    }

    // Endpoint para eliminar un negocio por su ID
    @DeleteMapping("/{businessId}")
    public ResponseEntity<String> deleteBusiness(@PathVariable String businessId) {
        businessService.deleteBusiness(businessId);
        return ResponseEntity.ok("Business with businessId " + businessId + " has been deleted.");
    }
}

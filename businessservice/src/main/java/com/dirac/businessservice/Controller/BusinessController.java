package com.dirac.businessservice.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.dirac.businessservice.DTOs.ResponseDTO;
import com.dirac.businessservice.Model.BusinessModel;
import com.dirac.businessservice.Service.BusinessService;

@RestController
@RequestMapping("/api/")
public class BusinessController {

    @Autowired
    private BusinessService businessService;

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

    @DeleteMapping("/{businessId}")
    public ResponseEntity<ResponseDTO<String>> deleteBusiness(@PathVariable String businessId) {
        businessService.deleteBusiness(businessId);
        return ResponseEntity.ok(new ResponseDTO<>(200, "Business deleted successfully.", businessId));
    }
}

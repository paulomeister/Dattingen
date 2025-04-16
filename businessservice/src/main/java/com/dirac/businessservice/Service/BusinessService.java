package com.dirac.businessservice.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dirac.businessservice.Exception.BusinessNotFoundException;
import com.dirac.businessservice.Model.BusinessModel;
import com.dirac.businessservice.Repository.BusinessRepository;

@Service
public class BusinessService {

    @Autowired
    private BusinessRepository businessRepository;

    public BusinessModel getBusinessById(String businessId) {
        return businessRepository.findByBusinessId(businessId)
                .orElseThrow(() -> new BusinessNotFoundException("Business with ID " + businessId + " not found."));
    }

    public BusinessModel saveBusiness(BusinessModel businessModel) {
        return businessRepository.save(businessModel);
    }

    public BusinessModel updateBusiness(String businessId, BusinessModel businessModel) {
        BusinessModel existingBusiness = businessRepository.findByBusinessId(businessId)
                .orElseThrow(() -> new BusinessNotFoundException("Business with ID " + businessId + " not found."));
        // Update fields
        existingBusiness.setName(businessModel.getName());
        existingBusiness.setActivity(businessModel.getActivity());
        existingBusiness.setAssociates(businessModel.getAssociates());
        existingBusiness.setAudits(businessModel.getAudits());
        return businessRepository.save(existingBusiness);
    }

    public void deleteBusiness(String businessId) {
        BusinessModel existingBusiness = businessRepository.findByBusinessId(businessId)
                .orElseThrow(() -> new BusinessNotFoundException("Business with ID " + businessId + " not found."));
        businessRepository.delete(existingBusiness);
    }
}

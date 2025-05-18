package com.dirac.businessservice.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.dirac.businessservice.Exception.BusinessNotFoundException;
import com.dirac.businessservice.Model.AsociateModel;
import com.dirac.businessservice.Model.AuditModel;
import com.dirac.businessservice.Model.BusinessModel;
import com.dirac.businessservice.Repository.BusinessRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@Service
public class BusinessService {

    @Autowired
    private BusinessRepository businessRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${services.apigateway.url}")
    private String apiGatewayUrl;

    public BusinessModel getBusinessById(String _id) {
        return businessRepository.findById(_id)
                .orElseThrow(() -> new BusinessNotFoundException("Business with ID " + _id + " not found."));
    }

    public List<BusinessModel> findBusinessesByName(String name) {
        Pattern pattern = Pattern.compile(name, Pattern.CASE_INSENSITIVE);
        return businessRepository.findByNameRegex(pattern.pattern());
    }

    public BusinessModel saveBusiness(BusinessModel businessModel) {
        BusinessModel savedBusiness = businessRepository.save(businessModel);
        if (savedBusiness.getAssociates() != null && !savedBusiness.getAssociates().isEmpty()) {
            List<String> userIds = savedBusiness.getAssociates().stream()
                    .map(AsociateModel::get_id)
                    .toList();
            updateUsersBusinessId(savedBusiness.get_id(), userIds);
        }
        return savedBusiness;
    }

    private void updateUsersBusinessId(String businessId, List<String> userIds) {
        try {
            String url = apiGatewayUrl + "/users/api/businesses/" + businessId + "/users";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("userIds", userIds);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            restTemplate.exchange(url, HttpMethod.POST, entity, Void.class);
            System.out.println("Successfully updated " + userIds.size() + " users with businessId: " + businessId);
        } catch (Exception e) {
            System.err.println("Error updating users with businessId: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public BusinessModel updateBusiness(String _id, BusinessModel businessModel) {
        BusinessModel existingBusiness = businessRepository.findById(_id)
                .orElseThrow(() -> new BusinessNotFoundException("Business with ID " + _id + " not found."));
        existingBusiness.setName(businessModel.getName());
        existingBusiness.setActivity(businessModel.getActivity());
        existingBusiness.setAssociates(businessModel.getAssociates());
        existingBusiness.setAudits(businessModel.getAudits());
        return businessRepository.save(existingBusiness);
    }

    public String addAudit(String businessId, AuditModel auditModel) {
        BusinessModel existingBusiness = businessRepository.findById(businessId)
                .orElseThrow(() -> new BusinessNotFoundException("Business with ID " + businessId + " not found."));
        if (existingBusiness.getAudits() != null) {
            for (AuditModel audit : existingBusiness.getAudits()) {
                if (audit.getRulesetId().equals(auditModel.getRulesetId())) {
                    throw new Error("Audit with Ruleset ID " + auditModel.getRulesetId() + " already exists.");
                }
            }
        }
        existingBusiness.getAudits().add(auditModel);
        businessRepository.save(existingBusiness);
        return "New Audit of " + auditModel.getRulesetId() + " Added.";
    }

    public void deleteBusiness(String _id) {
        BusinessModel existingBusiness = businessRepository.findById(_id)
                .orElseThrow(() -> new BusinessNotFoundException("Business with ID " + _id + " not found."));
        businessRepository.delete(existingBusiness);
    }

    public List<BusinessModel> findAllBusinesses() {
        return businessRepository.findTop20ByOrderByNameAsc();
    }

    public BusinessModel registerAuditors(String businessId, List<AsociateModel> associates) {
        BusinessModel business = businessRepository.findById(businessId)
                .orElseThrow(() -> new BusinessNotFoundException("Business with ID " + businessId + " not found."));
        if (business.getAssociates() == null) {
            business.setAssociates(associates);
        } else {
            List<String> existingIds = business.getAssociates().stream()
                    .map(AsociateModel::get_id)
                    .toList();
            for (AsociateModel associate : associates) {
                if (!existingIds.contains(associate.get_id())) {
                    business.getAssociates().add(associate);
                }
            }
        }
        BusinessModel updatedBusiness = businessRepository.save(business);
        List<String> userIds = associates.stream()
                .map(AsociateModel::get_id)
                .toList();
        updateUsersBusinessId(businessId, userIds);
        return updatedBusiness;
    }

    public AuditModel getAuditByRulesetId(String businessId, String rulesetId) {
        BusinessModel business = businessRepository.findById(businessId)
                .orElseThrow(() -> new BusinessNotFoundException("Business with ID " + businessId + " not found."));
        if (business.getAudits() != null) {
            return business.getAudits().stream()
                    .filter(audit -> audit.getRulesetId().equals(rulesetId))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException(
                            "Audit with Ruleset ID " + rulesetId + " not found in business " + businessId));
        }
        throw new RuntimeException("No audits found for business " + businessId);
    }
}

package com.dirac.businessservice.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.dirac.businessservice.DTOs.AuditStatisticsDTO;
import com.dirac.businessservice.Exception.BusinessNotFoundException;
import com.dirac.businessservice.Model.AuditModel;
import com.dirac.businessservice.Model.BusinessModel;
import com.dirac.businessservice.Repository.BusinessRepository;

@Service
public class AuditStatisticsService {

    @Autowired
    private BusinessRepository businessRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${services.apigateway.url}")
    private String apiGatewayUrl;

    /**
     * Obtener estadísticas completas de auditoría para un negocio y un ruleset específicos
     * 
     * @param businessId ID del negocio
     * @param rulesetId ID del ruleset
     * @return DTO con todas las estadísticas requeridas
     */
    public AuditStatisticsDTO getCompleteAuditStatistics(String businessId, String rulesetId) {
        BusinessModel business = businessRepository.findById(businessId)
                .orElseThrow(() -> new BusinessNotFoundException("Business with ID " + businessId + " not found."));
        
        AuditStatisticsDTO statistics = new AuditStatisticsDTO();
        
        // Business statistics
        calculateBusinessStatistics(business, rulesetId, statistics);
        
        // Audit Process statistics 
        calculateAuditProcessStatistics(businessId, rulesetId, statistics);
        
        return statistics;
    }
    
    /**
     * Calcular estadísticas relacionadas con el negocio
     */
    private void calculateBusinessStatistics(BusinessModel business, String rulesetId, AuditStatisticsDTO statistics) {
        List<AuditModel> audits = business.getAudits();
        
        // Total audits
        statistics.setTotalAudits(audits != null ? audits.size() : 0);
        
        // Active audits (not COMPLETED or CANCELED)
        int activeAudits = 0;
        String auditWithMostProcesses = null;
        int maxProcesses = 0;
        double totalDurationDays = 0;
        int auditsWithDates = 0;
        
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        
        if (audits != null) {
            for (AuditModel audit : audits) {
                // Count active audits
                if (audit.getStatus() != null && 
                    !audit.getStatus().equals("COMPLETED") && 
                    !audit.getStatus().equals("CANCELED")) {
                    activeAudits++;
                }
                
                // Find audit with most processes
                if (audit.getProcessCount() != null && audit.getProcessCount() > maxProcesses) {
                    maxProcesses = audit.getProcessCount();
                    auditWithMostProcesses = audit.getName();
                }
                
                // Calculate average duration
                if (audit.getStartDate() != null && audit.getEndDate() != null) {
                    try {
                        Date startDate = dateFormat.parse(audit.getStartDate());
                        Date endDate = dateFormat.parse(audit.getEndDate());
                        long durationMillis = endDate.getTime() - startDate.getTime();
                        double durationDays = TimeUnit.MILLISECONDS.toDays(durationMillis);
                        totalDurationDays += durationDays;
                        auditsWithDates++;
                    } catch (ParseException e) {
                        // Skip this audit if dates can't be parsed
                    }
                }
            }
        }
        
        statistics.setActiveAudits(activeAudits);
        statistics.setMostProcessesAudit(auditWithMostProcesses);
        
        // Calculate average duration if we have at least one audit with valid dates
        if (auditsWithDates > 0) {
            statistics.setAverageDuration(totalDurationDays / auditsWithDates);
        } else {
            statistics.setAverageDuration(0.0);
        }
    }    /**
     * Calcular estadísticas relacionadas con los procesos de auditoría
     */
    @SuppressWarnings({"unchecked", "rawtypes"})
    private void calculateAuditProcessStatistics(String businessId, String rulesetId, AuditStatisticsDTO statistics) {
        // Call auditprocess service through API Gateway
        String url = apiGatewayUrl + "/auditprocess/api/statistics/business/" + businessId + "/ruleset/" + rulesetId;
        
        try {
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, null, Map.class);
            Map<String, Object> data = response.getBody();
            
            if (data != null) {
                try {
                    // Set compliance percentages
                    if (data.containsKey("compliancePercentages")) {
                        Object raw = data.get("compliancePercentages");
                        if (raw instanceof Map) {
                            // Usar método seguro para la conversión
                            statistics.setCompliancePercentages(convertToStringDoubleMap((Map<?, ?>) raw));
                        }
                    }
                    
                    // Set non-compliance percentages
                    if (data.containsKey("nonCompliancePercentages")) {
                        Object raw = data.get("nonCompliancePercentages");
                        if (raw instanceof Map) {
                            // Usar método seguro para la conversión
                            statistics.setNonCompliancePercentages(convertToStringDoubleMap((Map<?, ?>) raw));
                        }
                    }
                    
                    // Set PHVA cycle with most non-compliances
                    if (data.containsKey("phvaCycleWithMostNonCompliances")) {
                        Object raw = data.get("phvaCycleWithMostNonCompliances");
                        // Convertir a String de forma segura
                        statistics.setPhvaCycleWithMostNonCompliances(raw != null ? raw.toString() : "N/A");
                    }
                    
                    // Set PHVA cycle non-compliance counts
                    if (data.containsKey("phvaCycleNonComplianceCounts")) {
                        Object raw = data.get("phvaCycleNonComplianceCounts");
                        if (raw instanceof Map) {
                            // Usar método seguro para la conversión
                            statistics.setPhvaCycleNonComplianceCounts(convertToStringIntegerMap((Map<?, ?>) raw));
                        }
                    }
                } catch (Exception e) {
                    System.err.println("Error al procesar datos del servicio de auditoría: " + e.getMessage());
                    initializeEmptyStatistics(statistics);
                }
            } else {
                initializeEmptyStatistics(statistics);
            }
        } catch (Exception e) {
            System.err.println("Error al llamar al servicio de auditoría: " + e.getMessage());
            // In case of error, initialize with empty values
            initializeEmptyStatistics(statistics);
        }
    }
    
    /**
     * Convierte de forma segura un mapa genérico a un mapa de String a Double
     */
    private Map<String, Double> convertToStringDoubleMap(Map<?, ?> sourceMap) {
        Map<String, Double> resultMap = new HashMap<>();
        
        if (sourceMap != null) {
            for (Map.Entry<?, ?> entry : sourceMap.entrySet()) {
                String key = entry.getKey() != null ? entry.getKey().toString() : "";
                Double value = null;
                
                if (entry.getValue() instanceof Number) {
                    value = ((Number) entry.getValue()).doubleValue();
                } else if (entry.getValue() instanceof String) {
                    try {
                        value = Double.parseDouble((String) entry.getValue());
                    } catch (NumberFormatException e) {
                        // Skip this entry if value is not a valid number
                    }
                }
                
                if (value != null) {
                    resultMap.put(key, value);
                }
            }
        }
        
        return resultMap;
    }
    
    /**
     * Convierte de forma segura un mapa genérico a un mapa de String a Integer
     */
    private Map<String, Integer> convertToStringIntegerMap(Map<?, ?> sourceMap) {
        Map<String, Integer> resultMap = new HashMap<>();
        
        if (sourceMap != null) {
            for (Map.Entry<?, ?> entry : sourceMap.entrySet()) {
                String key = entry.getKey() != null ? entry.getKey().toString() : "";
                Integer value = null;
                
                if (entry.getValue() instanceof Number) {
                    value = ((Number) entry.getValue()).intValue();
                } else if (entry.getValue() instanceof String) {
                    try {
                        value = Integer.parseInt((String) entry.getValue());
                    } catch (NumberFormatException e) {
                        // Skip this entry if value is not a valid number
                    }
                }
                
                if (value != null) {
                    resultMap.put(key, value);
                }
            }
        }
        
        return resultMap;
    }
    
    /**
     * Initialize statistics with empty values when data is not available
     */
    private void initializeEmptyStatistics(AuditStatisticsDTO statistics) {
        statistics.setCompliancePercentages(new HashMap<>());
        statistics.setNonCompliancePercentages(new HashMap<>());
        statistics.setPhvaCycleWithMostNonCompliances("N/A");
        statistics.setPhvaCycleNonComplianceCounts(new HashMap<>());
    }
}

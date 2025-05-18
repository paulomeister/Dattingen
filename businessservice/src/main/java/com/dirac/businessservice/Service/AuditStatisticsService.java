package com.dirac.businessservice.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.dirac.businessservice.DTOs.AuditStatisticsDTO;
import com.dirac.businessservice.DTOs.AuditStatisticsResponseDTO;
import com.dirac.businessservice.DTOs.AuditStatisticsResponseDTO.AuditDetailDTO;
import com.dirac.businessservice.DTOs.AuditStatisticsResponseDTO.PHVAInformitiesDTO;
import com.dirac.businessservice.DTOs.AuditStatisticsResponseDTO.TendencyDTO;
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
     * Obtener estadísticas completas de auditoría para un negocio y un ruleset
     * específicos
     * 
     * @param businessId ID del negocio
     * @param rulesetId  ID del ruleset
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

                // TODO Verificar esto.
                if (audit.getProcessCount() != null) {
                    // Hacer algo con el conteo de procesos
                }

                // Count active audits
                if (audit.getStatus() != null &&
                        !audit.getStatus().toUpperCase().equals("COMPLETED") &&
                        !audit.getStatus().toUpperCase().equals("CANCELED")) {
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
    }

    /**
     * Calcular estadísticas relacionadas con los procesos de auditoría
     */
    @SuppressWarnings({ "unchecked", "rawtypes" })
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

    /**
     * Obtener el nombre del ruleset desde el servicio de rulesets
     * 
     * @param rulesetId ID del ruleset
     * @return Nombre del ruleset o "Ruleset Desconocido" si no se puede obtener
     */
    @SuppressWarnings({ "unchecked", "rawtypes" })
    private String getRulesetName(String rulesetId) {
        // Llamar al servicio de rulesets a través del API Gateway
        String url = apiGatewayUrl + "/rulesets/api/findbyid/" + rulesetId;

        try {
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, null, Map.class);
            Map<String, Object> data = response.getBody();

            if (data != null && data.containsKey("name")) {
                return data.get("name").toString();
            }
        } catch (Exception e) {
            System.err.println("Error al obtener información del ruleset: " + e.getMessage());
        }

        return "Ruleset " + rulesetId;
    }

    /**
     * Obtener estadísticas de auditoría en el formato solicitado para todas las
     * auditorías de un negocio
     * 
     * @param businessId ID del negocio
     * @return DTO con el formato de estadísticas requerido
     */
    public AuditStatisticsResponseDTO getFormattedAuditStatistics(String businessId) {
        // Crear el nuevo DTO con el formato solicitado
        AuditStatisticsResponseDTO formattedStats = new AuditStatisticsResponseDTO();

        // Obtener el negocio para acceder a la lista de auditorías
        BusinessModel business = businessRepository.findById(businessId)
                .orElseThrow(() -> new BusinessNotFoundException("Business with ID " + businessId + " not found."));

        // Establecer estadísticas generales
        List<AuditModel> audits = business.getAudits();
        formattedStats.setTotalAudits(audits != null ? audits.size() : 0);

        // Calcular auditorías activas y tiempo promedio
        int activeAudits = 0;
        double totalDurationDays = 0;
        int auditsWithDates = 0;

        // Buscar la auditoría con más procesos
        AuditModel auditWithMostProcesses = null;
        int maxProcesses = 0;

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
                    auditWithMostProcesses = audit;
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

        formattedStats.setTotalAuditsActive(activeAudits);
        formattedStats.setAuditsWithMostProcesses(auditWithMostProcesses);

        // Calculate average duration if we have at least one audit with valid dates
        if (auditsWithDates > 0) {
            formattedStats.setMeanAuditTime((int) (totalDurationDays / auditsWithDates));
        } else {
            formattedStats.setMeanAuditTime(0);
        }

        // Crear lista de detalles de auditoría
        List<AuditDetailDTO> auditDetails = new ArrayList<>();

        // Procesar todas las auditorías del negocio
        if (audits != null) {
            for (AuditModel audit : audits) {
                // Solo procesar auditorías que tengan un rulesetId
                if (audit.getRulesetId() != null) {
                    try {
                        // Obtener las estadísticas específicas para esta auditoría y su ruleset
                        AuditStatisticsDTO auditStats = getCompleteAuditStatistics(businessId, audit.getRulesetId());
                        AuditDetailDTO detail = new AuditDetailDTO();

                        // Obtener el nombre del ruleset
                        String rulesetName = getRulesetName(audit.getRulesetId());
                        detail.setRulesetName(rulesetName);

                        // Obtener porcentajes de conformidad y no conformidad
                        Map<String, Double> compliancePercentages = auditStats.getCompliancePercentages();
                        Map<String, Double> nonCompliancePercentages = auditStats.getNonCompliancePercentages();

                        // Asignar valores si existen, verificando que los mapas y claves no sean nulos
                        if (compliancePercentages != null && audit.get_id() != null
                                && compliancePercentages.containsKey(audit.get_id())) {
                            detail.setConformityProcess(compliancePercentages.get(audit.get_id()).floatValue());
                        } else {
                            detail.setConformityProcess(0.0f);
                        }

                        if (nonCompliancePercentages != null && audit.get_id() != null
                                && nonCompliancePercentages.containsKey(audit.get_id())) {
                            detail.setNonConformityProcess(nonCompliancePercentages.get(audit.get_id()).floatValue());
                        } else {
                            detail.setNonConformityProcess(0.0f);
                        }

                        // Crear objeto para las no conformidades por ciclo PHVA
                        PHVAInformitiesDTO phvaInformities = new PHVAInformitiesDTO();

                        // Obtener conteos por ciclo PHVA
                        Map<String, Integer> phvaCounts = auditStats.getPhvaCycleNonComplianceCounts();

                        // Asignar valores para cada fase del ciclo PHVA, verificando que el mapa no sea
                        // nulo
                        if (phvaCounts != null) {
                            phvaInformities.setPlan(phvaCounts.containsKey("PLAN") ? phvaCounts.get("PLAN") : 0);
                            phvaInformities.setDoPhase(phvaCounts.containsKey("DO") ? phvaCounts.get("DO") : 0);
                            phvaInformities.setCheck(phvaCounts.containsKey("CHECK") ? phvaCounts.get("CHECK") : 0);
                            phvaInformities.setAct(phvaCounts.containsKey("ACT") ? phvaCounts.get("ACT") : 0);
                        } else {
                            phvaInformities.setPlan(0);
                            phvaInformities.setDoPhase(0);
                            phvaInformities.setCheck(0);
                            phvaInformities.setAct(0);
                        }

                        detail.setPhvaInformities(phvaInformities);

                        // Generar datos de tendencia de conformidades
                        List<TendencyDTO> tendencyData = generateConformityTendencyData(audit);
                        detail.setConformityTendency(tendencyData);

                        // Agregar el detalle a la lista
                        auditDetails.add(detail);
                    } catch (Exception e) {
                        System.err.println("Error al procesar la auditoría " + audit.get_id() + ": " + e.getMessage());
                        // Continuar con la siguiente auditoría
                    }
                }
            }
        }

        // Establecer la lista de detalles en el DTO de respuesta
        formattedStats.setAudits(auditDetails);

        return formattedStats;
    }

    private List<TendencyDTO> generateConformityTendencyData(AuditModel audit) {
        List<TendencyDTO> tendencyData = new ArrayList<>();

        // Si solo hay un proceso de auditoría, la fecha debe ser la del proceso (fecha
        // de finalización)
        // Por defecto se usa el mes actual
        int monthToUse = Calendar.getInstance().get(Calendar.MONTH) + 1; // +1 porque Calendar.MONTH es 0-based
        int yearToUse = Calendar.getInstance().get(Calendar.YEAR);

        // Intentar obtener la fecha del fin del proceso de auditoría
        if (audit.getEndDate() != null) {
            try {
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                Date endDate = dateFormat.parse(audit.getEndDate());
                Calendar cal = Calendar.getInstance();
                cal.setTime(endDate);
                monthToUse = cal.get(Calendar.MONTH) + 1; // +1 porque Calendar.MONTH es 0-based
                yearToUse = cal.get(Calendar.YEAR);
            } catch (ParseException e) {
                System.err.println("Error al parsear fecha de auditoría: " + e.getMessage());
            }
        }

        // Crear un solo punto de datos para este mes y año específico
        // con valor cero porque no hay evaluaciones reales todavía
        String dateFormatted = String.format("%02d-%04d", monthToUse, yearToUse);
        TendencyDTO tendencyItem = new TendencyDTO(dateFormatted, 0);
        tendencyData.add(tendencyItem);

        return tendencyData;
    }
}

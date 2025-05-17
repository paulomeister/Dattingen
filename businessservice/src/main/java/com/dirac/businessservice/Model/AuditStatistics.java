package com.dirac.businessservice.Model;

import java.util.HashMap;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Modelo para estadísticas de auditorías
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuditStatistics {
    
    // Total de auditorías en el sistema
    private int totalAudits;
    
    // Número de auditorías activas
    private int activeAudits;
    
    // Número de auditorías completadas
    private int completedAudits;
    
    // Duración promedio de las auditorías (en días)
    private double averageAuditDuration;
    
    // Top auditorías con más procesos de auditoría
    private Map<String, Integer> topAuditsByProcessCount = new HashMap<>();
    
    // Distribución de auditorías por estado
    private Map<String, Integer> auditsByStatus = new HashMap<>();
    
    // Distribución de auditorías por tipo de negocio
    private Map<String, Integer> auditsByBusinessType = new HashMap<>();
    
    // Fecha de la última actualización de las estadísticas
    private String lastUpdated;
}

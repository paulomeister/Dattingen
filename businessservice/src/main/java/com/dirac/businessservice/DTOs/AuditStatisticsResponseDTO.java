package com.dirac.businessservice.DTOs;

import java.util.List;
import com.dirac.businessservice.Model.AuditModel;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditStatisticsResponseDTO {
    // Estadísticas generales
    private Integer totalAudits;
    private Integer totalAuditsActive;
    private AuditModel auditsWithMostProcesses;
    private Integer meanAuditTime;
    
    // Lista de estadísticas por auditoría
    private List<AuditDetailDTO> audits;    // DTO anidado para detalles de cada auditoría
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuditDetailDTO {
        private String rulesetName; // Nombre del ruleset
        private Float conformityProcess;
        private Float nonConformityProcess;
        private PHVAInformitiesDTO phvaInformities;
        private List<TendencyDTO> conformityTendency; // Tendencia de conformidades a lo largo del tiempo
    }
      // DTO para representar las no conformidades por ciclo PHVA
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PHVAInformitiesDTO {
        private Integer plan;
        private Integer doPhase; 
        private Integer check;
        private Integer act;
    }
    
    // DTO para representar la tendencia de conformidades a lo largo del tiempo
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TendencyDTO {
        private String fecha;
        private Integer cantidadConformidades;
    }
}

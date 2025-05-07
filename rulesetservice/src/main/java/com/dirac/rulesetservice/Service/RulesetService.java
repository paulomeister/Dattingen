package com.dirac.rulesetservice.Service;

import com.dirac.rulesetservice.Model.RulesetModel;
import com.dirac.rulesetservice.Model.RulesetModel.ComplianceLevel;
import com.dirac.rulesetservice.Model.RulesetModel.Control;
import com.dirac.rulesetservice.Model.RulesetModel.PHVAPhase;
import com.dirac.rulesetservice.Repository.RulesetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RulesetService {

    @Autowired
    private RulesetRepository rulesetRepository;

    // Create
    public RulesetModel createRuleset(RulesetModel ruleset) {
        return rulesetRepository.save(ruleset);
    }

    // Read
    public List<RulesetModel> getAllRulesets() {
        return rulesetRepository.findAll();
    }

    public Optional<RulesetModel> getRulesetById(String id) {
        return rulesetRepository.findById(id);
    }

    public List<String> getAllCompulsoriness() {
        return ComplianceLevel.getAllInEnglish();
    }

    public List<String> getAllCompulsorinessInSpanish() {
        return ComplianceLevel.getAllInSpanish();
    }

    // Update
    public RulesetModel updateRuleset(RulesetModel ruleset) {
        if (rulesetRepository.existsById(ruleset.get_id())) {
            return rulesetRepository.save(ruleset);
        }
        return null;
    }

    /**
     * Publica un Ruleset cambiando su estado a "published"
     * 
     * @param rulesetId ID del Ruleset que se va a publicar
     * @return El Ruleset actualizado, o null si no existe
     * @throws RuntimeException si el Ruleset no existe
     */
    public RulesetModel publishRuleset(String rulesetId) {
        RulesetModel ruleset = getRulesetById(rulesetId)
                .orElseThrow(() -> new RuntimeException("Ruleset not found with id: " + rulesetId));
        
        // Actualizar el estado a "published"
        ruleset.setStatus("published");
        
        // Guardar y devolver el Ruleset actualizado
        return rulesetRepository.save(ruleset);
    }

    // Delete
    public void deleteRuleset(String id) {
        rulesetRepository.deleteById(id);
    }

    public RulesetModel addControl(String rulesetId, Control control) {
        RulesetModel ruleset = getRulesetById(rulesetId)
                .orElseThrow(() -> new RuntimeException("Ruleset not found"));

        // Validar fase PHVA
        if (control.getCycleStage() == null) {
            throw new IllegalArgumentException("PHVA phase is required");
        }

        // Validar nivel de obligatoriedad
        if (control.getCompulsoriness() == null) {
            throw new IllegalArgumentException("Compliance level is required");
        }

        ruleset.getControls().add(control);
        return rulesetRepository.save(ruleset);
    }

    public List<Control> findControlsByPhase(PHVAPhase phase) {
        return rulesetRepository.findAll().stream()
                .flatMap(ruleset -> ruleset.getControls().stream())
                .filter(control -> control.getCycleStage() == phase)
                .collect(Collectors.toList());
    }
}

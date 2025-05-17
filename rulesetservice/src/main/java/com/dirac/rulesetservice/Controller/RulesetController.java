package com.dirac.rulesetservice.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.dirac.rulesetservice.DTO.ResponseAzure;
import com.dirac.rulesetservice.Model.RulesetModel;
import com.dirac.rulesetservice.Model.RulesetModel.Control;
import com.dirac.rulesetservice.Model.RulesetModel.PHVAPhase;
import com.dirac.rulesetservice.Service.FileUtils;
import com.dirac.rulesetservice.Service.RulesetService;

import lombok.extern.slf4j.Slf4j;

@Slf4j // package: lombok.extern.slf4j
@RestController
@RequestMapping("/api")
public class RulesetController {

    @Autowired
    FileUtils fileUtils;
    @Autowired
    private RulesetService rulesetService;

    @PostMapping(value = "/uploadFile")
    @PreAuthorize("hasAnyRole('admin', 'Coordinator')")
    public ResponseAzure uploadFile(@RequestPart MultipartFile file) {
        return fileUtils.uploadFileInAzureStorage(file);
    }

    @GetMapping(value = "/downloadFile/{fileName}")
    @PreAuthorize("hasAnyRole('admin', 'Coordinator', 'InternalAuditor', 'ExternalAuditor')")
    public ResponseEntity<InputStreamResource> downloadFile(
            @PathVariable("fileName") String fileName) {
        log.info("Downloading file " + fileName);
        InputStreamResource file = fileUtils.downloadFile(fileName);

        // Set the appropriate content type and header for the file download
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName);
        headers.add(HttpHeaders.CONTENT_TYPE, "application/octet-stream");

        return new ResponseEntity<>(file, headers, HttpStatus.OK);
    }

    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('admin', 'Coordinator')")
    public ResponseEntity<RulesetModel> createRuleset(@RequestBody RulesetModel ruleset) {
        log.info("Creating new ruleset: {}", ruleset.getName());
        RulesetModel created = rulesetService.createRuleset(ruleset);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/ListAll")
    @PreAuthorize("hasAnyRole('admin', 'Coordinator', 'InternalAuditor', 'ExternalAuditor')")
    public ResponseEntity<List<RulesetModel>> getAllRulesets() {
        log.info("Fetching all rulesets");
        List<RulesetModel> rulesets = rulesetService.getAllRulesets();
        return new ResponseEntity<>(rulesets, HttpStatus.OK);
    }

    @GetMapping("/findbyid/{id}")
    @PreAuthorize("hasAnyRole('admin', 'Coordinator', 'InternalAuditor', 'ExternalAuditor')")
    public ResponseEntity<RulesetModel> getRulesetById(@PathVariable String id) {
        log.info("Fetching ruleset with id: {}", id);
        return rulesetService.getRulesetById(id)
                .map(ruleset -> new ResponseEntity<>(ruleset, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/ListCompulsoriness")
    @PreAuthorize("hasAnyRole('admin', 'Coordinator', 'InternalAuditor', 'ExternalAuditor')")
    public ResponseEntity<List<String>> getAllCompulsoriness() {
        log.info("Fetching all compliance levels");
        List<String> complianceLevels = rulesetService.getAllCompulsoriness();
        return new ResponseEntity<>(complianceLevels, HttpStatus.OK);
    }

    @GetMapping("/ListCompulsoriness/es")
    @PreAuthorize("hasAnyRole('admin', 'Coordinator', 'InternalAuditor', 'ExternalAuditor')")
    public ResponseEntity<List<String>> getAllCompulsorinessInSpanish() {
        log.info("Fetching all compliance levels");
        List<String> complianceLevels = rulesetService.getAllCompulsorinessInSpanish();
        return new ResponseEntity<>(complianceLevels, HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasAnyRole('admin', 'Coordinator')")
    public ResponseEntity<RulesetModel> updateRuleset(
            @PathVariable String id,
            @RequestBody RulesetModel ruleset) {
        log.info("Updating ruleset with id: {}", id);
        if (!id.equals(ruleset.get_id())) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        RulesetModel updated = rulesetService.updateRuleset(ruleset);
        return updated != null ? new ResponseEntity<>(updated, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    /**
     * Publica un Ruleset cambiando su estado a "published"
     * 
     * @param id ID del Ruleset a publicar
     * @return Respuesta con mensaje de éxito y el Ruleset actualizado
     */
    @PutMapping("/publish/{id}")
    @PreAuthorize("hasAnyRole('admin', 'Coordinator')")
    public ResponseEntity<?> publishRuleset(@PathVariable String id) {
        log.info("Publishing ruleset with id: {}", id);
        try {
            RulesetModel published = rulesetService.publishRuleset(id);
            
            return ResponseEntity
                    .ok()
                    .body(Map.of(
                            "message", "Ruleset publicado exitosamente",
                            "ruleset", published));
        } catch (RuntimeException e) {
            log.error("Error publishing ruleset: {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error publishing ruleset: {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al publicar ruleset: " + e.getMessage()));
        }
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAnyRole('admin', 'Coordinator')")
    public ResponseEntity<Void> deleteRuleset(@PathVariable String id) {
        log.info("Deleting ruleset with id: {}", id);
        if (rulesetService.getRulesetById(id).isPresent()) {
            rulesetService.deleteRuleset(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/{rulesetId}/controls")
    @PreAuthorize("hasAnyRole('admin', 'Coordinator')")
    public ResponseEntity<?> addControl(
            @PathVariable String rulesetId,
            @RequestBody Control control) {
        log.info("Adding control to ruleset: {}", rulesetId);
        try {
            RulesetModel updated = rulesetService.addControl(rulesetId, control);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(Map.of(
                            "message", "Control agregado exitosamente",
                            "ruleset", updated));
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", "Error al agregar el control: " + e.getMessage()));
        }
    }

    @GetMapping("/controls/phase/{phase}")
    @PreAuthorize("hasAnyRole('admin', 'Coordinator', 'InternalAuditor', 'ExternalAuditor')")
    public ResponseEntity<List<Control>> getControlsByPhase(
            @PathVariable PHVAPhase phase) {
        log.info("Fetching controls for PHVA phase: {}", phase);
        List<Control> controls = rulesetService.findControlsByPhase(phase);
        return ResponseEntity.ok(controls);
    }
}

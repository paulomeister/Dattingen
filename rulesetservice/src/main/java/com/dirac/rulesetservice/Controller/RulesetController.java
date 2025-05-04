package com.dirac.rulesetservice.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.dirac.rulesetservice.DTO.ResponseAzure;
import com.dirac.rulesetservice.Model.RulesetModel;
import com.dirac.rulesetservice.Model.RulesetModel.ComplianceLevel;
import com.dirac.rulesetservice.Model.RulesetModel.Control;
import com.dirac.rulesetservice.Model.RulesetModel.PHVAPhase;
import com.dirac.rulesetservice.Service.FileUtils;
import com.dirac.rulesetservice.Service.RulesetService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api")
public class RulesetController {

    @Autowired
    FileUtils fileUtils;
    @Autowired
    private RulesetService rulesetService;

    @PostMapping(value = "/uploadFile")
    public ResponseAzure uploadFile(@RequestPart MultipartFile file) {
        return fileUtils.uploadFileInAzureStorage(file);
    }

    @GetMapping(value = "/downloadFile/{fileName}")
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
    public ResponseEntity<RulesetModel> createRuleset(@RequestBody RulesetModel ruleset) {
        log.info("Creating new ruleset: {}", ruleset.getName());
        RulesetModel created = rulesetService.createRuleset(ruleset);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/ListAll")
    public ResponseEntity<List<RulesetModel>> getAllRulesets() {
        log.info("Fetching all rulesets");
        List<RulesetModel> rulesets = rulesetService.getAllRulesets();
        return new ResponseEntity<>(rulesets, HttpStatus.OK);
    }

    @GetMapping("/findbyid/{id}")
    public ResponseEntity<RulesetModel> getRulesetById(@PathVariable String id) {
        log.info("Fetching ruleset with id: {}", id);
        return rulesetService.getRulesetById(id)
                .map(ruleset -> new ResponseEntity<>(ruleset, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/ListCompulsoriness")
    public ResponseEntity<List<String>> getAllCompulsoriness() {
        log.info("Fetching all compliance levels");
        List<String> complianceLevels = rulesetService.getAllCompulsoriness();
        return new ResponseEntity<>(complianceLevels, HttpStatus.OK);
    }

    @GetMapping("/ListCompulsoriness/es")
    public ResponseEntity<List<String>> getAllCompulsorinessInSpanish() {
        log.info("Fetching all compliance levels");
        List<String> complianceLevels = rulesetService.getAllCompulsorinessInSpanish();
        return new ResponseEntity<>(complianceLevels, HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
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

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteRuleset(@PathVariable String id) {
        log.info("Deleting ruleset with id: {}", id);
        if (rulesetService.getRulesetById(id).isPresent()) {
            rulesetService.deleteRuleset(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/{rulesetId}/controls")
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
    public ResponseEntity<List<Control>> getControlsByPhase(
            @PathVariable PHVAPhase phase) {
        log.info("Fetching controls for PHVA phase: {}", phase);
        List<Control> controls = rulesetService.findControlsByPhase(phase);
        return ResponseEntity.ok(controls);
    }
}

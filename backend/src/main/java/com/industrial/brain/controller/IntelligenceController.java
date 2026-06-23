package com.industrial.brain.controller;

import com.industrial.brain.service.engine.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/intelligence")
public class IntelligenceController {

    private final MaintenanceEngine maintenanceEngine;
    private final ComplianceEngine complianceEngine;
    private final IncidentEngine incidentEngine;

    public IntelligenceController(MaintenanceEngine maintenanceEngine,
                                  ComplianceEngine complianceEngine,
                                  IncidentEngine incidentEngine) {
        this.maintenanceEngine = maintenanceEngine;
        this.complianceEngine = complianceEngine;
        this.incidentEngine = incidentEngine;
    }

    @GetMapping("/maintenance/schedule")
    public ResponseEntity<List<Map<String, Object>>> getPredictiveSchedule() {
        return ResponseEntity.ok(maintenanceEngine.getPredictiveSchedule());
    }

    @GetMapping("/maintenance/metrics/{assetId}")
    public ResponseEntity<Map<String, Object>> getAssetMaintenanceMetrics(@PathVariable Long assetId) {
        return ResponseEntity.ok(maintenanceEngine.getAssetMetrics(assetId));
    }

    @GetMapping("/compliance")
    public ResponseEntity<Map<String, Object>> getComplianceReport() {
        return ResponseEntity.ok(complianceEngine.generateComplianceReport());
    }

    @GetMapping("/incidents")
    public ResponseEntity<Map<String, Object>> getIncidentAnalysis() {
        return ResponseEntity.ok(incidentEngine.analyzeIncidents());
    }
}

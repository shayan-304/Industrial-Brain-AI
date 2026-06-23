package com.industrial.brain.service.engine;

import com.industrial.brain.model.Incident;
import com.industrial.brain.repository.IncidentRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class IncidentEngine {

    private final IncidentRepository incidentRepository;

    public IncidentEngine(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    public Map<String, Object> analyzeIncidents() {
        List<Incident> allIncidents = incidentRepository.findAll();
        
        long totalCount = allIncidents.size();
        long openCount = allIncidents.stream().filter(i -> "OPEN".equals(i.getStatus())).count();
        long criticalCount = allIncidents.stream().filter(i -> "CRITICAL".equalsIgnoreCase(i.getSeverity())).count();
        
        Map<String, Long> countBySeverity = allIncidents.stream()
                .collect(Collectors.groupingBy(Incident::getSeverity, Collectors.counting()));

        List<Map<String, Object>> patterns = detectNearMissPatterns(allIncidents);

        Map<String, Object> analysis = new HashMap<>();
        analysis.put("totalCount", totalCount);
        analysis.put("openCount", openCount);
        analysis.put("criticalCount", criticalCount);
        analysis.put("countBySeverity", countBySeverity);
        analysis.put("detectedPatterns", patterns);

        return analysis;
    }

    private List<Map<String, Object>> detectNearMissPatterns(List<Incident> incidents) {
        List<Map<String, Object>> patterns = new ArrayList<>();
        
        // Group incidents by asset
        Map<String, List<Incident>> incidentsByAsset = incidents.stream()
                .filter(i -> i.getAsset() != null)
                .collect(Collectors.groupingBy(i -> i.getAsset().getTag()));

        for (Map.Entry<String, List<Incident>> entry : incidentsByAsset.entrySet()) {
            String assetTag = entry.getKey();
            List<Incident> assetIncidents = entry.getValue();

            // Sort by date descending
            assetIncidents.sort((a, b) -> b.getIncidentDate().compareTo(a.getIncidentDate()));

            if (assetIncidents.size() >= 2) {
                // If there are multiple incidents on the same asset within a short period
                Map<String, Object> pattern = new HashMap<>();
                pattern.put("assetTag", assetTag);
                pattern.put("incidentCount", assetIncidents.size());
                pattern.put("patternType", "RECURRING_ASSET_INSTABILITY");
                pattern.put("severity", assetIncidents.stream().anyMatch(i -> "CRITICAL".equalsIgnoreCase(i.getSeverity())) ? "CRITICAL" : "HIGH");
                pattern.put("details", "Multiple failures/near-misses reported for asset " + assetTag + 
                        " within the inspection logs. This indicates potential systemic wear or inadequate baseline repairs.");
                pattern.put("preventiveAction", "Conduct complete structural teardown, review baseline calibration logs, and evaluate sensor tolerances.");
                patterns.add(pattern);
            }
        }

        // Check for general patterns (e.g. general department/worker safety)
        long electricalCount = incidents.stream()
                .filter(i -> i.getDescription().toLowerCase().contains("electric") || i.getDescription().toLowerCase().contains("wire"))
                .count();

        if (electricalCount >= 2) {
            Map<String, Object> pattern = new HashMap<>();
            pattern.put("patternType", "ELECTRICAL_HAZARD_TREND");
            pattern.put("incidentCount", electricalCount);
            pattern.put("severity", "HIGH");
            pattern.put("details", "Multiple incidents mention electrical malfunctions or wiring wear across the site.");
            pattern.put("preventiveAction", "Schedule general electrical thermal scanning audits and safety retraining on Lockout/Tagout (LOTO) protocols.");
            patterns.add(pattern);
        }

        return patterns;
    }
}

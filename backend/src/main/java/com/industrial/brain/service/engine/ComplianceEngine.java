package com.industrial.brain.service.engine;

import com.industrial.brain.model.Asset;
import com.industrial.brain.model.Incident;
import com.industrial.brain.model.MaintenanceRecord;
import com.industrial.brain.repository.AssetRepository;
import com.industrial.brain.repository.IncidentRepository;
import com.industrial.brain.repository.MaintenanceRecordRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class ComplianceEngine {

    private final IncidentRepository incidentRepository;
    private final MaintenanceRecordRepository maintenanceRepository;
    private final AssetRepository assetRepository;

    public ComplianceEngine(IncidentRepository incidentRepository,
                            MaintenanceRecordRepository maintenanceRepository,
                            AssetRepository assetRepository) {
        this.incidentRepository = incidentRepository;
        this.maintenanceRepository = maintenanceRepository;
        this.assetRepository = assetRepository;
    }

    public Map<String, Object> generateComplianceReport() {
        List<Incident> openIncidents = incidentRepository.findByStatus("OPEN");
        List<Asset> assets = assetRepository.findAll();
        
        double score = 100.0;
        List<Map<String, String>> gaps = new ArrayList<>();

        // 1. Check for open incidents
        for (Incident inc : openIncidents) {
            Map<String, String> gap = new HashMap<>();
            gap.put("id", "GAP_INC_" + inc.getId());
            gap.put("type", "SAFETY_INCIDENT");
            gap.put("severity", inc.getSeverity());
            
            if ("CRITICAL".equalsIgnoreCase(inc.getSeverity())) {
                score -= 15.0;
                gap.put("regulation", "OSHA 1910.119 - Process Safety Management");
                gap.put("description", "Critical safety incident on asset " + 
                        (inc.getAsset() != null ? inc.getAsset().getTag() : "General") + 
                        " is currently open: " + inc.getDescription());
            } else if ("HIGH".equalsIgnoreCase(inc.getSeverity())) {
                score -= 10.0;
                gap.put("regulation", "OSHA 1910.303 - General Electrical Requirements");
                gap.put("description", "High-severity safety alert pending investigation: " + inc.getDescription());
            } else {
                score -= 5.0;
                gap.put("regulation", "ISO 45001 - Occupational Health & Safety");
                gap.put("description", "Minor incident open. Pending action: " + inc.getDescription());
            }
            gaps.add(gap);
        }

        // 2. Check for overdue predictive maintenance
        for (Asset asset : assets) {
            List<MaintenanceRecord> records = maintenanceRepository.findByAssetId(asset.getId());
            int interval = getMaintenanceIntervalDays(asset.getType());
            LocalDate lastService = asset.getInstallationDate();

            if (!records.isEmpty()) {
                records.sort((a, b) -> b.getMaintenanceDate().compareTo(a.getMaintenanceDate()));
                lastService = records.get(0).getMaintenanceDate();
            }

            long elapsed = ChronoUnit.DAYS.between(lastService, LocalDate.now());
            if (elapsed > interval) {
                score -= 8.0;
                Map<String, String> gap = new HashMap<>();
                gap.put("id", "GAP_MAINT_" + asset.getTag());
                gap.put("type", "PREDICTIVE_MAINT_OVERDUE");
                gap.put("severity", "HIGH");
                gap.put("regulation", "ISO 9001 / OSHA 1910.303");
                gap.put("description", "Asset " + asset.getTag() + " (" + asset.getName() + 
                        ") maintenance is overdue by " + (elapsed - interval) + " days.");
                gaps.add(gap);
            }
        }

        score = Math.max(0.0, score);

        Map<String, Object> report = new HashMap<>();
        report.put("overallScore", score);
        report.put("status", getComplianceStatusLabel(score));
        report.put("auditDate", LocalDate.now());
        report.put("detectedGaps", gaps);
        report.put("totalCheckedAssets", assets.size());
        report.put("openIssuesCount", gaps.size());

        return report;
    }

    private int getMaintenanceIntervalDays(String type) {
        return switch (type.toLowerCase()) {
            case "pump" -> 90;
            case "boiler" -> 180;
            case "regulator", "valve" -> 120;
            default -> 150;
        };
    }

    private String getComplianceStatusLabel(double score) {
        if (score >= 90) return "FULLY_COMPLIANT";
        if (score >= 75) return "COMPLIANT_WITH_RISKS";
        return "NON_COMPLIANT";
    }
}

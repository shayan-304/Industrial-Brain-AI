package com.industrial.brain.service.engine;

import com.industrial.brain.model.Asset;
import com.industrial.brain.model.MaintenanceRecord;
import com.industrial.brain.repository.AssetRepository;
import com.industrial.brain.repository.MaintenanceRecordRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class MaintenanceEngine {

    private final MaintenanceRecordRepository maintenanceRepository;
    private final AssetRepository assetRepository;

    public MaintenanceEngine(MaintenanceRecordRepository maintenanceRepository, AssetRepository assetRepository) {
        this.maintenanceRepository = maintenanceRepository;
        this.assetRepository = assetRepository;
    }

    public List<Map<String, Object>> getPredictiveSchedule() {
        List<Asset> assets = assetRepository.findAll();
        List<Map<String, Object>> schedule = new ArrayList<>();

        for (Asset asset : assets) {
            List<MaintenanceRecord> records = maintenanceRepository.findByAssetId(asset.getId());
            
            // Default maintenance interval based on asset type
            int intervalDays = getMaintenanceIntervalDays(asset.getType());
            LocalDate lastMaintenanceDate = asset.getInstallationDate();
            
            if (!records.isEmpty()) {
                records.sort((a, b) -> b.getMaintenanceDate().compareTo(a.getMaintenanceDate()));
                lastMaintenanceDate = records.get(0).getMaintenanceDate();
            }

            LocalDate nextDueDate = lastMaintenanceDate.plusDays(intervalDays);
            long daysRemaining = ChronoUnit.DAYS.between(LocalDate.now(), nextDueDate);

            Map<String, Object> prediction = new HashMap<>();
            prediction.put("assetId", asset.getId());
            prediction.put("assetTag", asset.getTag());
            prediction.put("assetName", asset.getName());
            prediction.put("lastService", lastMaintenanceDate);
            prediction.put("nextDue", nextDueDate);
            prediction.put("daysRemaining", daysRemaining);
            
            String urgency;
            if (daysRemaining < 0) {
                urgency = "OVERDUE";
            } else if (daysRemaining <= 14) {
                urgency = "IMMINENT";
            } else {
                urgency = "NORMAL";
            }
            prediction.put("urgency", urgency);
            prediction.put("recommendedAction", getRecommendedAction(asset.getType(), urgency));

            schedule.add(prediction);
        }

        return schedule;
    }

    public Map<String, Object> getAssetMetrics(Long assetId) {
        List<MaintenanceRecord> records = maintenanceRepository.findByAssetId(assetId);
        Map<String, Object> metrics = new HashMap<>();

        double totalCost = records.stream()
                .mapToDouble(r -> r.getCost() != null ? r.getCost() : 0.0)
                .sum();

        // Calculate MTBF (Mean Time Between Failures)
        double mtbfDays = 0.0;
        if (records.size() > 1) {
            records.sort(Comparator.comparing(MaintenanceRecord::getMaintenanceDate));
            long totalDays = 0;
            for (int i = 0; i < records.size() - 1; i++) {
                totalDays += ChronoUnit.DAYS.between(
                        records.get(i).getMaintenanceDate(),
                        records.get(i+1).getMaintenanceDate()
                );
            }
            mtbfDays = (double) totalDays / (records.size() - 1);
        } else {
            mtbfDays = 180.0; // Default estimate
        }

        metrics.put("totalMaintenanceEvents", records.size());
        metrics.put("totalMaintenanceCost", totalCost);
        metrics.put("mtbfDays", mtbfDays);
        metrics.put("reliabilityIndex", calculateReliabilityIndex(mtbfDays, records.size()));

        return metrics;
    }

    private int getMaintenanceIntervalDays(String type) {
        return switch (type.toLowerCase()) {
            case "pump" -> 90;      // 3 Months
            case "boiler" -> 180;   // 6 Months
            case "regulator", "valve" -> 120; // 4 Months
            default -> 150;
        };
    }

    private String getRecommendedAction(String type, String urgency) {
        if ("OVERDUE".equals(urgency)) {
            return "IMMEDIATE SHUTDOWN & calibration and bearing check required.";
        }
        return switch (type.toLowerCase()) {
            case "pump" -> "Check bearing temperature, vibration readings, and seal leakage.";
            case "boiler" -> "Conduct ultrasound wall thickness scanning and pressure valve checks.";
            default -> "Perform routine visual inspection and clean mechanical contacts.";
        };
    }

    private double calculateReliabilityIndex(double mtbf, int eventsCount) {
        if (eventsCount == 0) return 100.0;
        double base = mtbf / 180.0 * 100.0;
        double penalty = eventsCount * 5.0;
        return Math.clamp(base - penalty, 20.0, 100.0);
    }
}

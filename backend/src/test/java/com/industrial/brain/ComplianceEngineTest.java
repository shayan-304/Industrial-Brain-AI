package com.industrial.brain;

import com.industrial.brain.model.*;
import com.industrial.brain.repository.*;
import com.industrial.brain.service.engine.ComplianceEngine;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

public class ComplianceEngineTest {

    private IncidentRepository incidentRepository;
    private MaintenanceRecordRepository maintenanceRepository;
    private AssetRepository assetRepository;
    private ComplianceEngine complianceEngine;

    @BeforeEach
    public void setUp() {
        incidentRepository = Mockito.mock(IncidentRepository.class);
        maintenanceRepository = Mockito.mock(MaintenanceRecordRepository.class);
        assetRepository = Mockito.mock(AssetRepository.class);
        complianceEngine = new ComplianceEngine(incidentRepository, maintenanceRepository, assetRepository);
    }

    @Test
    public void testCleanComplianceReport() {
        when(incidentRepository.findByStatus("OPEN")).thenReturn(Collections.emptyList());
        when(assetRepository.findAll()).thenReturn(Collections.emptyList());

        Map<String, Object> report = complianceEngine.generateComplianceReport();
        assertEquals(100.0, report.get("overallScore"), "Clean facility should have 100% score");
        assertEquals("FULLY_COMPLIANT", report.get("status"), "Clean facility should be FULLY_COMPLIANT");
    }

    @Test
    public void testComplianceScoreDeductionForCriticalIncident() {
        Asset mockAsset = Asset.builder().id(1L).tag("B-12").name("Boiler").type("Boiler").department("Operations").build();
        User mockUser = User.builder().firstName("John").lastName("Doe").build();
        Incident criticalIncident = Incident.builder()
                .id(10L)
                .asset(mockAsset)
                .reporter(mockUser)
                .description("Steam casing leak warning")
                .severity("CRITICAL")
                .status("OPEN")
                .incidentDate(LocalDate.now())
                .build();

        when(incidentRepository.findByStatus("OPEN")).thenReturn(List.of(criticalIncident));
        when(assetRepository.findAll()).thenReturn(Collections.emptyList());

        Map<String, Object> report = complianceEngine.generateComplianceReport();
        assertEquals(85.0, report.get("overallScore"), "Critical incident should deduct 15 points (100 - 15 = 85)");
        assertEquals("COMPLIANT_WITH_RISKS", report.get("status"), "85% score is COMPLIANT_WITH_RISKS");
        
        List<?> gaps = (List<?>) report.get("detectedGaps");
        assertEquals(1, gaps.size(), "There should be 1 detected gap");
    }
}

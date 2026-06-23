package com.industrial.brain;

import com.industrial.brain.model.Asset;
import com.industrial.brain.model.Incident;
import com.industrial.brain.model.User;
import com.industrial.brain.repository.IncidentRepository;
import com.industrial.brain.service.engine.IncidentEngine;
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

public class IncidentEngineTest {

    private IncidentRepository incidentRepository;
    private IncidentEngine incidentEngine;

    @BeforeEach
    public void setUp() {
        incidentRepository = Mockito.mock(IncidentRepository.class);
        incidentEngine = new IncidentEngine(incidentRepository);
    }

    @Test
    public void testEmptyIncidentsAnalysis() {
        when(incidentRepository.findAll()).thenReturn(Collections.emptyList());

        Map<String, Object> result = incidentEngine.analyzeIncidents();
        assertEquals(0L, result.get("totalCount"), "Total count should be 0");
        assertEquals(0L, result.get("openCount"), "Open count should be 0");
        assertTrue(((List<?>) result.get("detectedPatterns")).isEmpty(), "No patterns should be found");
    }

    @Test
    public void testRecurringAssetInstabilityDetection() {
        Asset mockAsset = Asset.builder().id(1L).tag("P-101").name("Water Pump").type("Pump").department("Operations").build();
        User mockUser = User.builder().firstName("John").lastName("Doe").build();
        
        Incident inc1 = Incident.builder()
                .id(1L)
                .asset(mockAsset)
                .reporter(mockUser)
                .description("Vibration spike detected")
                .severity("MEDIUM")
                .status("OPEN")
                .incidentDate(LocalDate.now().minusDays(5))
                .build();

        Incident inc2 = Incident.builder()
                .id(2L)
                .asset(mockAsset)
                .reporter(mockUser)
                .description("High operating temperature logs")
                .severity("HIGH")
                .status("OPEN")
                .incidentDate(LocalDate.now().minusDays(2))
                .build();

        when(incidentRepository.findAll()).thenReturn(List.of(inc1, inc2));

        Map<String, Object> result = incidentEngine.analyzeIncidents();
        assertEquals(2L, result.get("totalCount"), "Total count should be 2");
        assertEquals(2L, result.get("openCount"), "Open count should be 2");

        List<?> patterns = (List<?>) result.get("detectedPatterns");
        assertEquals(1, patterns.size(), "Should detect 1 recurring instability trend");
        
        Map<?, ?> pattern = (Map<?, ?>) patterns.get(0);
        assertEquals("RECURRING_ASSET_INSTABILITY", pattern.get("patternType"), "Pattern type should match asset instability");
        assertEquals("P-101", pattern.get("assetTag"), "Should identify P-101 as the unstable equipment");
    }
}

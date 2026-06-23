package com.industrial.brain.config;

import com.industrial.brain.model.*;
import com.industrial.brain.repository.*;
import com.industrial.brain.service.Neo4jService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AssetRepository assetRepository;
    private final DocumentRepository documentRepository;
    private final MaintenanceRecordRepository maintenanceRepository;
    private final IncidentRepository incidentRepository;
    private final ComplianceAuditRepository complianceRepository;
    private final PasswordEncoder passwordEncoder;
    private final Neo4jService neo4jService;

    public DatabaseSeeder(UserRepository userRepository, AssetRepository assetRepository,
                          DocumentRepository documentRepository, MaintenanceRecordRepository maintenanceRepository,
                          IncidentRepository incidentRepository, ComplianceAuditRepository complianceRepository,
                          PasswordEncoder passwordEncoder, Neo4jService neo4jService) {
        this.userRepository = userRepository;
        this.assetRepository = assetRepository;
        this.documentRepository = documentRepository;
        this.maintenanceRepository = maintenanceRepository;
        this.incidentRepository = incidentRepository;
        this.complianceRepository = complianceRepository;
        this.passwordEncoder = passwordEncoder;
        this.neo4jService = neo4jService;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return; // DB already seeded
        }

        // 1. Seed Users
        User admin = User.builder()
                .username("admin@industrial.com")
                .password(passwordEncoder.encode("admin123"))
                .firstName("Alex")
                .lastName("Chief")
                .role(UserRole.ADMIN)
                .build();

        User engineer = User.builder()
                .username("engineer@industrial.com")
                .password(passwordEncoder.encode("engineer123"))
                .firstName("John")
                .lastName("Doe")
                .role(UserRole.ENGINEER)
                .build();

        User safety = User.builder()
                .username("safety@industrial.com")
                .password(passwordEncoder.encode("safety123"))
                .firstName("Sarah")
                .lastName("Connor")
                .role(UserRole.SAFETY_OFFICER)
                .build();

        User auditor = User.builder()
                .username("auditor@industrial.com")
                .password(passwordEncoder.encode("auditor123"))
                .firstName("Robert")
                .lastName("Vance")
                .role(UserRole.AUDITOR)
                .build();

        userRepository.saveAll(List.of(admin, engineer, safety, auditor));

        // Sync users to Neo4j
        neo4jService.addNode("emp_John", "User", "John Doe (Eng)", "Senior Mechanical Technician");
        neo4jService.addNode("emp_Sarah", "User", "Sarah Connor (Saf)", "Safety Director");

        // 2. Seed Assets
        Asset pump = Asset.builder()
                .tag("P-101")
                .name("Centrifugal Water Pump")
                .type("Pump")
                .department("Operations")
                .status("OPERATIONAL")
                .specifications("Flow rate: 250 m3/h, Motor: 45kW, RPM: 1450, Pressure: 4.2 bar")
                .installationDate(LocalDate.of(2024, 3, 12))
                .build();

        Asset boiler = Asset.builder()
                .tag("B-12")
                .name("High-Pressure Steam Boiler")
                .type("Boiler")
                .department("Operations")
                .status("MAINTENANCE")
                .specifications("Max pressure: 15 bar, Operating temp: 200C, Capacity: 10 t/h")
                .installationDate(LocalDate.of(2023, 8, 20))
                .build();

        Asset valve = Asset.builder()
                .tag("GV-4")
                .name("Gas Regulator Valve GV-4")
                .type("Valve")
                .department("Safety")
                .status("OPERATIONAL")
                .specifications("Solenoid activation, Size: DN100, Class: PN16")
                .installationDate(LocalDate.of(2025, 1, 10))
                .build();

        assetRepository.saveAll(List.of(pump, boiler, valve));

        // Sync Assets to Neo4j
        neo4jService.addNode("asset_P101", "Asset", "Pump P101", "Pump - Water Intake");
        neo4jService.addNode("asset_B12", "Asset", "Boiler B12", "Boiler - High Pressure Steam");
        neo4jService.addNode("asset_GV4", "Asset", "Regulator GV4", "Gas Feed Regulator Valve");

        // 3. Seed Maintenance Records
        MaintenanceRecord rec1 = MaintenanceRecord.builder()
                .asset(pump)
                .technician(engineer)
                .description("Replaced secondary seals, refilled bearing lubricants, checked vibration levels.")
                .maintenanceDate(LocalDate.now().minusDays(80))
                .cost(450.00)
                .rootCause("Standard seal wear and friction fatigue")
                .status("COMPLETED")
                .build();

        MaintenanceRecord rec2 = MaintenanceRecord.builder()
                .asset(boiler)
                .technician(engineer)
                .description("Conducted casing thickness scan. Sanded and prepped flange casing for seal replacement.")
                .maintenanceDate(LocalDate.now().minusDays(15))
                .cost(1200.00)
                .rootCause("Thermal stress oxidation")
                .status("COMPLETED")
                .build();

        maintenanceRepository.saveAll(List.of(rec1, rec2));

        // 4. Seed Incidents
        Incident inc1 = Incident.builder()
                .asset(boiler)
                .reporter(safety)
                .description("Surface rust corrosion identified on the outer casing header flange. Minor thermal scan variation.")
                .severity("MEDIUM")
                .incidentDate(LocalDate.now().minusDays(10))
                .status("OPEN")
                .actionsTaken("Cleaned flange and prepped coating. Scheduled shutdown repair.")
                .build();

        Incident inc2 = Incident.builder()
                .asset(pump)
                .reporter(engineer)
                .description("Elevated vibration readings logged in main bearing assembly. Temperature logged at 78C.")
                .severity("LOW")
                .incidentDate(LocalDate.now().minusDays(5))
                .status("OPEN")
                .actionsTaken("Topped up bearing grease. Monitoring telemetry.")
                .build();

        incidentRepository.saveAll(List.of(inc1, inc2));

        // 5. Seed Compliance Audits
        ComplianceAudit audit1 = ComplianceAudit.builder()
                .referenceStandard("OSHA 1910.119")
                .complianceScore(92.5)
                .findings("PSM review completed. Operations SOPs are up to date, but Boiler B-12 casing corrosion gap was logged.")
                .status("COMPLIANT_WITH_GAPS")
                .auditedDate(LocalDate.now().minusDays(2))
                .auditor(auditor)
                .build();

        complianceRepository.save(audit1);

        // 6. Seed Documents (RAG knowledgebase)
        Document doc1 = Document.builder()
                .fileName("SOP-SAF-042_Gas_Leak_Protocol.txt")
                .fileType("TXT")
                .status("PROCESSED")
                .department("Safety")
                .extractedText("""
                        === EMERGENCY PROCEDURES MANUAL ===
                        Document ID: SOP-SAF-042
                        Title: Emergency Gas Leak Response Protocol
                        Effective: 2025-01-01
                        
                        1. Evacuation: In case of gas detection alarm, immediately evacuate quadrant C.
                        2. Ventilation: Activate exhaust fans and ventilation systems on Panel-H.
                        3. Isolation: Close primary gas regulator valve GV-4 located in the gas feed line immediately.
                        4. Safety Gear: Deploy safety personnel equipped with Self-Contained Breathing Apparatus (SCBA).
                        5. Reporting: Contact Safety Director Sarah Connor immediately.
                        
                        Reference standard: OSHA 1910.119 - Process Safety Management (PSM).
                        """)
                .uploadedBy(admin)
                .build();

        Document doc2 = Document.builder()
                .fileName("P101_Intake_Pump_Manual.txt")
                .fileType("TXT")
                .status("PROCESSED")
                .department("Operations")
                .extractedText("""
                        === EQUIPMENT TECHNICAL MANUAL ===
                        Equipment Name: Centrifugal Water Intake Pump P-101
                        Manufacturer: PumpCorp Inc.
                        
                        Operation Specifications:
                        - Flow rate: 250 m3/h
                        - RPM: 1450 rpm
                        - Temperature Threshold: Alert at 72C, Shutdown at 82C.
                        - Vibration Threshold: Warning at 4.5 mm/s, Critical at 7.1 mm/s.
                        
                        Maintenance Guidelines:
                        - Lubricate primary bearings every 90 days of operation.
                        - Inspect main casing seals for degradation every 6 months.
                        - Re-align motor shaft assembly yearly.
                        """)
                .uploadedBy(admin)
                .build();

        documentRepository.saveAll(List.of(doc1, doc2));
    }
}

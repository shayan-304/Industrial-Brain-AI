package com.industrial.brain.controller;

import com.industrial.brain.model.MaintenanceRecord;
import com.industrial.brain.model.User;
import com.industrial.brain.repository.MaintenanceRecordRepository;
import com.industrial.brain.repository.UserRepository;
import com.industrial.brain.service.Neo4jService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceController {

    private final MaintenanceRecordRepository maintenanceRepository;
    private final UserRepository userRepository;
    private final Neo4jService neo4jService;

    public MaintenanceController(MaintenanceRecordRepository maintenanceRepository,
                                 UserRepository userRepository, Neo4jService neo4jService) {
        this.maintenanceRepository = maintenanceRepository;
        this.userRepository = userRepository;
        this.neo4jService = neo4jService;
    }

    @GetMapping
    public List<MaintenanceRecord> getAllMaintenance() {
        return maintenanceRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<MaintenanceRecord> createMaintenance(@Valid @RequestBody MaintenanceRecord record) {
        // Get technician from context
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            User technician = userRepository.findByUsername(username).orElseThrow();
            record.setTechnician(technician);
        }

        MaintenanceRecord saved = maintenanceRepository.save(record);

        // Sync to Knowledge Graph
        if (saved.getTechnician() != null && saved.getAsset() != null) {
            neo4jService.addEdge("emp_" + saved.getTechnician().getFirstName(), "asset_" + saved.getAsset().getTag(), "MAINTAINS");
        }

        return ResponseEntity.ok(saved);
    }
}

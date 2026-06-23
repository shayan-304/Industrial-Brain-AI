package com.industrial.brain.controller;

import com.industrial.brain.model.Incident;
import com.industrial.brain.model.User;
import com.industrial.brain.repository.IncidentRepository;
import com.industrial.brain.repository.UserRepository;
import com.industrial.brain.service.Neo4jService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    private final IncidentRepository incidentRepository;
    private final UserRepository userRepository;
    private final Neo4jService neo4jService;

    public IncidentController(IncidentRepository incidentRepository, UserRepository userRepository, Neo4jService neo4jService) {
        this.incidentRepository = incidentRepository;
        this.userRepository = userRepository;
        this.neo4jService = neo4jService;
    }

    @GetMapping
    public List<Incident> getAllIncidents() {
        return incidentRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Incident> createIncident(@Valid @RequestBody Incident incident) {
        // Get reporter from context
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            User reporter = userRepository.findByUsername(username).orElseThrow();
            incident.setReporter(reporter);
        }

        Incident saved = incidentRepository.save(incident);

        // Sync to Knowledge Graph
        String incidentNodeId = "inc_" + saved.getId();
        neo4jService.addNode(incidentNodeId, "Incident", "Inc-" + saved.getId() + ": " + saved.getSeverity(), saved.getDescription());
        
        if (saved.getAsset() != null) {
            neo4jService.addEdge(incidentNodeId, "asset_" + saved.getAsset().getTag(), "OCCURRED_ON");
        }
        neo4jService.addEdge("emp_" + saved.getReporter().getFirstName(), incidentNodeId, "INVESTIGATES");

        return ResponseEntity.ok(saved);
    }
}

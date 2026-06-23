package com.industrial.brain.controller;

import com.industrial.brain.service.Neo4jService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/graph")
public class GraphController {

    private final Neo4jService neo4jService;

    public GraphController(Neo4jService neo4jService) {
        this.neo4jService = neo4jService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getGraph() {
        return ResponseEntity.ok(neo4jService.getGraphData());
    }
}

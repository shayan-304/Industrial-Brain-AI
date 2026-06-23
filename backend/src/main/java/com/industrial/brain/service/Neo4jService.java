package com.industrial.brain.service;

import org.neo4j.driver.*;
import org.neo4j.driver.Record;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class Neo4jService {

    @Value("${neo4j.uri}")
    private String neo4jUri;

    @Value("${neo4j.username}")
    private String neo4jUsername;

    @Value("${neo4j.password}")
    private String neo4jPassword;

    private Driver driver;
    private boolean isConnected = false;

    // Fallback local memory representation of the graph
    private final List<Map<String, Object>> mockNodes = Collections.synchronizedList(new ArrayList<>());
    private final List<Map<String, Object>> mockEdges = Collections.synchronizedList(new ArrayList<>());

    @PostConstruct
    public void init() {
        try {
            if (neo4jUri != null && !neo4jUri.contains("localhost:7687") && !neo4jPassword.equals("password")) {
                driver = GraphDatabase.driver(neo4jUri, AuthTokens.basic(neo4jUsername, neo4jPassword));
                // Verify connectivity
                driver.verifyConnectivity();
                isConnected = true;
                initializeGraphDbSchema();
            }
        } catch (Exception e) {
            // Log warning, fallback to in-memory graph simulation
            isConnected = false;
        }

        // Initialize fallback/mock dataset if empty
        if (mockNodes.isEmpty()) {
            seedMockGraph();
        }
    }

    private void initializeGraphDbSchema() {
        if (!isConnected) return;
        try (Session session = driver.session()) {
            session.run("CREATE CONSTRAINT IF NOT EXISTS FOR (a:Asset) REQUIRE a.tag IS UNIQUE");
            session.run("CREATE CONSTRAINT IF NOT EXISTS FOR (u:User) REQUIRE u.username IS UNIQUE");
        } catch (Exception e) {
            // Ignore schema creation errors
        }
    }

    private void seedMockGraph() {
        // Sample Assets
        addNode("asset_P101", "Asset", "Pump P101", "Pump - Water Intake");
        addNode("asset_B12", "Asset", "Boiler B12", "Boiler - High Pressure Steam");
        addNode("asset_GV4", "Asset", "Regulator GV4", "Gas Feed Regulator Valve");

        // Departments
        addNode("dept_Ops", "Department", "Operations", "Main plant operations");
        addNode("dept_Maint", "Department", "Maintenance", "Equipment repairs & scheduling");
        addNode("dept_Safety", "Department", "Safety", "Industrial hazards control");

        // Employees
        addNode("emp_John", "User", "John Doe (Eng)", "Senior Mechanical Technician");
        addNode("emp_Sarah", "User", "Sarah Connor (Saf)", "Safety Director");

        // Regulations
        addNode("reg_OSHA_PSM", "Regulation", "OSHA 1910.119", "Process Safety Management");
        addNode("reg_OSHA_PV", "Regulation", "OSHA 1910.111", "Pressure Vessel Safety Standards");

        // Incidents
        addNode("inc_1", "Incident", "Inc-102: Flange Corrosion", "Boiler B12 corrosion leak risk");
        addNode("inc_2", "Incident", "Inc-105: Vibrations", "Pump P101 bearing temperature");

        // Relationships
        addEdge("asset_P101", "dept_Ops", "BELONGS_TO");
        addEdge("asset_B12", "dept_Ops", "BELONGS_TO");
        addEdge("asset_GV4", "dept_Ops", "BELONGS_TO");

        addEdge("emp_John", "dept_Maint", "MEMBER_OF");
        addEdge("emp_Sarah", "dept_Safety", "MEMBER_OF");

        addEdge("emp_John", "asset_P101", "MAINTAINS");
        addEdge("emp_John", "asset_B12", "MAINTAINS");

        addEdge("inc_1", "asset_B12", "OCCURRED_ON");
        addEdge("inc_2", "asset_P101", "OCCURRED_ON");

        addEdge("emp_Sarah", "inc_1", "INVESTIGATED_BY");
        addEdge("emp_Sarah", "inc_2", "INVESTIGATED_BY");

        addEdge("inc_1", "reg_OSHA_PV", "VIOLATES");
        addEdge("inc_2", "reg_OSHA_PSM", "RELEVANT_TO");
    }

    public synchronized void addNode(String id, String label, String name, String details) {
        Map<String, Object> node = new HashMap<>();
        node.put("id", id);
        node.put("label", label);
        node.put("name", name);
        node.put("details", details);
        mockNodes.add(node);

        if (isConnected) {
            try (Session session = driver.session()) {
                session.run("MERGE (n:" + label + " {id: $id}) " +
                                "ON CREATE SET n.name = $name, n.details = $details " +
                                "ON MATCH SET n.name = $name, n.details = $details",
                        Map.of("id", id, "name", name, "details", details));
            } catch (Exception e) {
                // Fail silently, fallback already updated
            }
        }
    }

    public synchronized void addEdge(String from, String to, String type) {
        Map<String, Object> edge = new HashMap<>();
        edge.put("from", from);
        edge.put("to", to);
        edge.put("label", type);
        mockEdges.add(edge);

        if (isConnected) {
            try (Session session = driver.session()) {
                // Find node labels dynamically or match generically
                session.run("MATCH (a {id: $from}), (b {id: $to}) " +
                                "MERGE (a)-[r:" + type + "]->(b)",
                        Map.of("from", from, "to", to));
            } catch (Exception e) {
                // Fail silently
            }
        }
    }

    public Map<String, Object> getGraphData() {
        if (!isConnected) {
            return Map.of("nodes", mockNodes, "edges", mockEdges);
        }

        try (Session session = driver.session()) {
            List<Map<String, Object>> nodesList = new ArrayList<>();
            List<Map<String, Object>> edgesList = new ArrayList<>();

            // Fetch nodes
            Result nodesResult = session.run("MATCH (n) RETURN n.id AS id, labels(n)[0] AS label, n.name AS name, n.details AS details");
            while (nodesResult.hasNext()) {
                Record record = nodesResult.next();
                Map<String, Object> node = new HashMap<>();
                node.put("id", record.get("id").asString());
                node.put("label", record.get("label").asString());
                node.put("name", record.get("name").asString());
                node.put("details", record.get("details").asString(""));
                nodesList.add(node);
            }

            // Fetch edges
            Result edgesResult = session.run("MATCH (s)-[r]->(t) RETURN s.id AS from, t.id AS to, type(r) AS label");
            while (edgesResult.hasNext()) {
                Record record = edgesResult.next();
                Map<String, Object> edge = new HashMap<>();
                edge.put("from", record.get("from").asString());
                edge.put("to", record.get("to").asString());
                edge.put("label", record.get("label").asString());
                edgesList.add(edge);
            }

            return Map.of("nodes", nodesList, "edges", edgesList);
        } catch (Exception e) {
            // Fallback if query fails
            return Map.of("nodes", mockNodes, "edges", mockEdges);
        }
    }

    @PreDestroy
    public void cleanup() {
        if (driver != null) {
            driver.close();
        }
    }
}

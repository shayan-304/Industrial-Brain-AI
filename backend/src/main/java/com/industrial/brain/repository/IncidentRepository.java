package com.industrial.brain.repository;

import com.industrial.brain.model.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {
    List<Incident> findByAssetId(Long assetId);
    List<Incident> findBySeverity(String severity);
    List<Incident> findByStatus(String status);
}

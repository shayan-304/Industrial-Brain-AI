package com.industrial.brain.repository;

import com.industrial.brain.model.ComplianceAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComplianceAuditRepository extends JpaRepository<ComplianceAudit, Long> {
}

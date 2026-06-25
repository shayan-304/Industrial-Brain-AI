package com.industrial.brain.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "compliance_audits")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplianceAudit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reference_standard", nullable = false)
    private String referenceStandard; // e.g., OSHA 1910.119, ISO 45001

    @Column(name = "compliance_score", nullable = false)
    private Double complianceScore; // 0.0 to 100.0

    @Column(columnDefinition = "TEXT")
    private String findings;

    @Column(nullable = false)
    private String status; // PASSED, COMPLIANT_WITH_GAPS, NON_COMPLIANT

    @Column(name = "audited_date", nullable = false)
    private LocalDate auditedDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auditor_id")
    private User auditor;
}

package com.industrial.brain.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "maintenance_records")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenanceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "technician_id")
    private User technician;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "maintenance_date", nullable = false)
    private LocalDate maintenanceDate;

    private Double cost;

    @Column(name = "root_cause", columnDefinition = "TEXT")
    private String rootCause;

    @Column(nullable = false)
    private String status; // SCHEDULED, COMPLETED, DELAYED
}

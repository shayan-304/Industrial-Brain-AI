package com.industrial.brain.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "assets")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(unique = true, nullable = false)
    private String tag; // e.g., P-101, B-12

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotBlank
    @Column(nullable = false)
    private String type; // e.g., Pump, Boiler, Pipe, Turbine

    @NotBlank
    @Column(nullable = false)
    private String department; // e.g., Operations, Maintenance, Safety

    @NotBlank
    @Column(nullable = false)
    private String status; // e.g., OPERATIONAL, MAINTENANCE, FAILED

    @Column(columnDefinition = "TEXT")
    private String specifications;

    @Column(name = "installation_date")
    private LocalDate installationDate;
}

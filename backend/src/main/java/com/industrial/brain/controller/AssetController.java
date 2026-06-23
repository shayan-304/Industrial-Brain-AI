package com.industrial.brain.controller;

import com.industrial.brain.model.Asset;
import com.industrial.brain.repository.AssetRepository;
import com.industrial.brain.service.Neo4jService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
public class AssetController {

    private final AssetRepository assetRepository;
    private final Neo4jService neo4jService;

    public AssetController(AssetRepository assetRepository, Neo4jService neo4jService) {
        this.assetRepository = assetRepository;
        this.neo4jService = neo4jService;
    }

    @GetMapping
    public List<Asset> getAllAssets() {
        return assetRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Asset> getAssetById(@PathVariable Long id) {
        return assetRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Asset> createAsset(@Valid @RequestBody Asset asset) {
        if (assetRepository.existsByTag(asset.getTag())) {
            return ResponseEntity.badRequest().build();
        }
        Asset savedAsset = assetRepository.save(asset);

        // Link to Knowledge Graph
        String nodeId = "asset_" + savedAsset.getTag();
        neo4jService.addNode(nodeId, "Asset", savedAsset.getName(), savedAsset.getType() + " (" + savedAsset.getTag() + ")");
        neo4jService.addEdge(nodeId, "dept_" + savedAsset.getDepartment().replace(" ", ""), "BELONGS_TO");

        return ResponseEntity.ok(savedAsset);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Asset> updateAsset(@PathVariable Long id, @Valid @RequestBody Asset assetDetails) {
        return assetRepository.findById(id)
                .map(existingAsset -> {
                    existingAsset.setName(assetDetails.getName());
                    existingAsset.setType(assetDetails.getType());
                    existingAsset.setDepartment(assetDetails.getDepartment());
                    existingAsset.setStatus(assetDetails.getStatus());
                    existingAsset.setSpecifications(assetDetails.getSpecifications());
                    existingAsset.setInstallationDate(assetDetails.getInstallationDate());
                    Asset updated = assetRepository.save(existingAsset);

                    // Update graph node
                    String nodeId = "asset_" + updated.getTag();
                    neo4jService.addNode(nodeId, "Asset", updated.getName(), updated.getType() + " (" + updated.getTag() + ")");

                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAsset(@PathVariable Long id) {
        return assetRepository.findById(id)
                .map(asset -> {
                    assetRepository.delete(asset);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}

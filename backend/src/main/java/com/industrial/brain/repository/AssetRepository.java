package com.industrial.brain.repository;

import com.industrial.brain.model.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {
    Optional<Asset> findByTag(String tag);
    boolean existsByTag(String tag);
}

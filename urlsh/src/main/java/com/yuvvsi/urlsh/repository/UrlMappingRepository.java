package com.yuvvsi.urlsh.repository;

import com.yuvvsi.urlsh.model.UrlMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UrlMappingRepository extends JpaRepository<UrlMapping, Long> {

    // Used to fetch original URL using short code
    Optional<UrlMapping> findByShortCode(String shortCode);
    List<UrlMapping> findByUsername(String username);

}
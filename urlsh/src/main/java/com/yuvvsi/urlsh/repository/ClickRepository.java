package com.yuvvsi.urlsh.repository;

import com.yuvvsi.urlsh.model.Click;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ClickRepository extends JpaRepository<Click, Long> {

    long countByShortCode(String shortCode);
    long countByUsername(String username);
    @Query("""
       SELECT DATE(c.clickedAt), COUNT(c)
       FROM Click c
       WHERE c.shortCode = :shortCode
       GROUP BY DATE(c.clickedAt)
       ORDER BY DATE(c.clickedAt)
       """)
    List<Object[]> countClicksByDate(@Param("shortCode") String shortCode);
    List<Click> findByShortCodeOrderByClickedAtDesc(String shortCode);

}
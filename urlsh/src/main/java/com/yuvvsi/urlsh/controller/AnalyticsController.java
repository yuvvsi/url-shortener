package com.yuvvsi.urlsh.controller;

import com.yuvvsi.urlsh.dto.UrlAnalyticsResponse;
import com.yuvvsi.urlsh.dto.UserAnalyticsResponse;
import com.yuvvsi.urlsh.service.UrlShortenerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final UrlShortenerService urlShortenerService;

    // 📊 Total clicks for ONE short URL
    @GetMapping("/{shortCode}/clicks")
    public ResponseEntity<Long> getClickCount(@PathVariable String shortCode) {
        long count = urlShortenerService.getClickCount(shortCode);
        return ResponseEntity.ok(count);
    }

    // 📊 Total clicks across ALL URLs of logged-in user
    @GetMapping("/my-total-clicks")
    public ResponseEntity<UserAnalyticsResponse> getMyAnalytics(
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                urlShortenerService.getDetailedAnalyticsForUser(userDetails.getUsername())
        );
    }
    @GetMapping("/{shortCode}")
    public ResponseEntity<UrlAnalyticsResponse> getAnalytics(@PathVariable String shortCode) {
        return ResponseEntity.ok(urlShortenerService.getDetailedAnalytics(shortCode));
    }

}
package com.yuvvsi.urlsh.service;

import com.yuvvsi.urlsh.dto.UrlAnalyticsResponse;
import com.yuvvsi.urlsh.dto.UserAnalyticsResponse;
import com.yuvvsi.urlsh.model.UrlMapping;

public interface UrlShortenerService {

    // Create a short URL for the given long URL
    UrlMapping shortenUrl(String longUrl, String username, Integer expiryMinutes);

    // Retrieve mapping using short code (used for redirect + analytics logging)
    UrlMapping getMapping(String shortCode);

    // BASIC analytics (you can keep these for internal use)
    long getClickCount(String shortCode);
    long getTotalClicksForUser(String username);

    // ⭐ NEW — Detailed analytics for one short URL
    UrlAnalyticsResponse getDetailedAnalytics(String shortCode);
    UserAnalyticsResponse getDetailedAnalyticsForUser(String username);
}
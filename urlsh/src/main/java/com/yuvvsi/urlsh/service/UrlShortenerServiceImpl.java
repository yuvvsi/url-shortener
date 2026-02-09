package com.yuvvsi.urlsh.service;

import com.yuvvsi.urlsh.dto.UrlAnalyticsResponse;
import com.yuvvsi.urlsh.dto.UserAnalyticsResponse;
import com.yuvvsi.urlsh.dto.UrlClickDetailsResponse;
import com.yuvvsi.urlsh.model.UrlMapping;
import com.yuvvsi.urlsh.repository.ClickRepository;
import com.yuvvsi.urlsh.repository.UrlMappingRepository;
import org.springframework.stereotype.Service;
import com.yuvvsi.urlsh.dto.ClickDetailResponse;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UrlShortenerServiceImpl implements UrlShortenerService {

    private final UrlMappingRepository urlMappingRepository;
    private final ClickRepository clickRepository;
    private final Random random = new Random();
    private static final String CHARACTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int SHORT_CODE_LENGTH = 6;

    public UrlShortenerServiceImpl(UrlMappingRepository urlMappingRepository, ClickRepository clickRepository) {
        this.urlMappingRepository = urlMappingRepository;
        this.clickRepository = clickRepository;
    }

    @Override
    public UrlMapping shortenUrl(String longUrl, String username) {
        if (longUrl == null || longUrl.isEmpty()) {
            throw new IllegalArgumentException("URL cannot be null or empty");
        }
        String shortCode = generateUniqueShortCode();

        UrlMapping mapping = new UrlMapping();
        mapping.setLongUrl(longUrl);
        mapping.setShortCode(shortCode);
        mapping.setCreatedAt(LocalDateTime.now());
        mapping.setUsername(username);

        return urlMappingRepository.save(mapping);
    }

    @Override
    public UrlMapping getMapping(String shortCode) {
        return urlMappingRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new RuntimeException("Short URL not found"));
    }

    // Generate a random 6-character alphanumeric code
    private String generateUniqueShortCode() {
        String code;
        do {
            code = generateRandomCode();
        } while (urlMappingRepository.findByShortCode(code).isPresent());
        return code;
    }

    private String generateRandomCode() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < SHORT_CODE_LENGTH; i++) {
            sb.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }
        return sb.toString();
    }
    @Override
    public long getClickCount(String shortCode) {
        return clickRepository.countByShortCode(shortCode);
    }

    @Override
    public long getTotalClicksForUser(String username) {
        return clickRepository.countByUsername(username);
    }

    @Override
    public UrlAnalyticsResponse getDetailedAnalytics(String shortCode) {

        // Ensure URL exists
        UrlMapping mapping = getMapping(shortCode);

        long totalClicks = clickRepository.countByShortCode(shortCode);

        List<Object[]> results = clickRepository.countClicksByDate(shortCode);

        Map<String, Long> clicksByDate = new HashMap<>();

        for (Object[] row : results) {
            String date = row[0].toString();   // e.g. 2026-02-08
            Long count = (Long) row[1];
            clicksByDate.put(date, count);
        }

        return new UrlAnalyticsResponse(shortCode, totalClicks, clicksByDate);
    }

    @Override
    public UserAnalyticsResponse getDetailedAnalyticsForUser(String username) {

        List<UrlMapping> userUrls = urlMappingRepository.findByUsername(username);

        long totalClicks = clickRepository.countByUsername(username);

        List<UrlClickDetailsResponse> urlDetailsList = userUrls.stream().map(url -> {

            List<ClickDetailResponse> clickDetails = clickRepository
                    .findByShortCodeOrderByClickedAtDesc(url.getShortCode())
                    .stream()
                    .map(click -> new ClickDetailResponse(
                            click.getClickedAt(),
                            click.getIpAddress(),
                            click.getUserAgent()
                    ))
                    .collect(Collectors.toList());

            return new UrlClickDetailsResponse(
                    url.getShortCode(),
                    url.getLongUrl(),
                    clickDetails.size(),
                    clickDetails
            );

        }).collect(Collectors.toList());

        return new UserAnalyticsResponse(totalClicks, urlDetailsList);
    }

}

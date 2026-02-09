package com.yuvvsi.urlsh.controller;

import com.yuvvsi.urlsh.dto.UrlShortenRequest;
import com.yuvvsi.urlsh.model.UrlMapping;
import com.yuvvsi.urlsh.service.UrlShortenerService;
import com.yuvvsi.urlsh.service.ClickService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import java.net.URI;

@RestController
@RequestMapping("/api/url")
public class UrlShortenerController {

    private final UrlShortenerService urlShortenerService;
    private final ClickService clickService;

    public UrlShortenerController(UrlShortenerService urlShortenerService,
                                  ClickService clickService) {
        this.urlShortenerService = urlShortenerService;
        this.clickService = clickService;
    }

    // Endpoint to create a short URL
    @PostMapping("/shorten")
    public ResponseEntity<UrlMapping> shortenUrl(
            @RequestBody UrlShortenRequest request,
            @AuthenticationPrincipal UserDetails userDetails // get the logged-in user
    ) {
        String username = userDetails.getUsername(); // or user ID if you prefer
        UrlMapping mapping = urlShortenerService.shortenUrl(request.getLongUrl(), username);
        return new ResponseEntity<>(mapping, HttpStatus.CREATED);
    }


    // Endpoint to redirect to original URL from short code
    @GetMapping("/{shortCode}")
    public ResponseEntity<Void> redirectToOriginalUrl(
            @PathVariable String shortCode,
            HttpServletRequest request
    ) {
        try {
            UrlMapping mapping = urlShortenerService.getMapping(shortCode);

            // Record analytics click
            clickService.recordClick(mapping, request);

            URI uri = URI.create(mapping.getLongUrl());

            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(uri)
                    .build();

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}

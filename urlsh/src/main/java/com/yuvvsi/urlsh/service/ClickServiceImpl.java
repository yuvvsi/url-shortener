package com.yuvvsi.urlsh.service;

import com.yuvvsi.urlsh.model.Click;
import com.yuvvsi.urlsh.model.UrlMapping;
import com.yuvvsi.urlsh.repository.ClickRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ClickServiceImpl implements ClickService {

    private final ClickRepository clickRepository;

    @Override
    public void recordClick(UrlMapping mapping, HttpServletRequest request) {

        Click click = Click.builder()
                .shortCode(mapping.getShortCode())   // which link was clicked
                .username(mapping.getUsername())     // owner of the link
                .ipAddress(request.getRemoteAddr())  // visitor IP
                .userAgent(request.getHeader("User-Agent"))
                .clickedAt(LocalDateTime.now())
                .build();

        clickRepository.save(click);
    }
}
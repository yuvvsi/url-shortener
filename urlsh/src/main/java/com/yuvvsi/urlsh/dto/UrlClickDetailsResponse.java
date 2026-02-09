package com.yuvvsi.urlsh.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class UrlClickDetailsResponse {
    private String shortCode;
    private String longUrl;
    private long totalClicks;
    private List<ClickDetailResponse> clicks;
}
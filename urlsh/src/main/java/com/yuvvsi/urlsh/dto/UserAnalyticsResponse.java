package com.yuvvsi.urlsh.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class UserAnalyticsResponse {
    private long totalClicks;
    private List<UrlClickDetailsResponse> urls;
}
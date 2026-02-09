package com.yuvvsi.urlsh.service;

import com.yuvvsi.urlsh.model.UrlMapping;
import jakarta.servlet.http.HttpServletRequest;

public interface ClickService {
    void recordClick(UrlMapping mapping, HttpServletRequest request);
}
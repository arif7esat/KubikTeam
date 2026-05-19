package com.smartcart.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.*;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private final Map<String, Deque<Long>> requestLog = new ConcurrentHashMap<>();

    private static final int PRODUCTS_LIMIT = 30;
    private static final int CHAT_LIMIT = 10;
    private static final long WINDOW_MS = 60_000L;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {

        String uri = request.getRequestURI();
        boolean isChat = uri.startsWith("/api/chat");
        boolean isProducts = uri.startsWith("/api/products") || uri.startsWith("/api/recommendations");

        if (!isChat && !isProducts) {
            chain.doFilter(request, response);
            return;
        }

        String ip = getClientIp(request);
        String key = ip + ":" + (isChat ? "chat" : "products");
        int limit = isChat ? CHAT_LIMIT : PRODUCTS_LIMIT;

        long now = System.currentTimeMillis();
        requestLog.compute(key, (k, deque) -> {
            if (deque == null) deque = new ArrayDeque<>();
            while (!deque.isEmpty() && now - deque.peekFirst() > WINDOW_MS) {
                deque.pollFirst();
            }
            deque.addLast(now);
            return deque;
        });

        int count = requestLog.get(key).size();
        if (count > limit) {
            response.setStatus(429);
            response.setHeader("Retry-After", "60");
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Çok fazla istek. Lütfen 60 saniye bekleyin.\"}");
            return;
        }

        chain.doFilter(request, response);
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}

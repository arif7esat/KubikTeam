package com.smartcart.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartcart.model.dto.GeminiRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@Service
public class GeminiService {

    private static final Logger log = LoggerFactory.getLogger(GeminiService.class);

    private final String apiKey;
    private final String apiUrl;
    private final RestTemplate restTemplate;
    private final ObjectMapper mapper;

    public GeminiService(
            @Value("${gemini.api.key}") String apiKey,
            @Value("${gemini.api.url}") String apiUrl) {
        this.apiKey = apiKey;
        this.apiUrl = apiUrl;

        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(10000);
        factory.setReadTimeout(30000);
        this.restTemplate = new RestTemplate(factory);
        this.mapper = new ObjectMapper();
    }

    public Map<String, Object> call(GeminiRequest request) {
        try {
            List<Map<String, Object>> parts = new ArrayList<>();
            parts.add(Map.of("text", request.getTextPrompt()));

            if (request.getImageBase64() != null && !request.getImageBase64().isEmpty()) {
                parts.add(Map.of("inline_data", Map.of(
                    "mime_type", request.getImageMimeType() != null ? request.getImageMimeType() : "image/jpeg",
                    "data", request.getImageBase64()
                )));
            }

            Map<String, Object> body = Map.of(
                "contents", List.of(Map.of("parts", parts)),
                "generationConfig", Map.of("temperature", 0.3, "maxOutputTokens", 1024)
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                apiUrl + "?key=" + apiKey, entity, Map.class
            );

            String text = extractText(response.getBody());
            return parseJson(text);

        } catch (ResourceAccessException e) {
            log.error("Gemini timeout hatası: {}", e.getMessage());
            return fallbackMap();
        } catch (HttpClientErrorException e) {
            log.error("Gemini HTTP hatası: {}", e.getMessage());
            return fallbackMap();
        } catch (Exception e) {
            log.error("Gemini beklenmeyen hata: {}", e.getMessage());
            return fallbackMap();
        }
    }

    @SuppressWarnings("unchecked")
    private String extractText(Map body) {
        try {
            List<Map> candidates = (List<Map>) body.get("candidates");
            Map candidate = candidates.get(0);
            Map content = (Map) candidate.get("content");
            List<Map> parts = (List<Map>) content.get("parts");
            Map part = parts.get(0);
            return (String) part.get("text");
        } catch (Exception e) {
            log.error("Gemini response text çıkarma hatası: {}", e.getMessage());
            return "";
        }
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> parseJson(String raw) {
        try {
            String cleaned = raw.replaceAll("(?s)```json\\s*", "")
                    .replaceAll("```", "")
                    .trim();

            int start = cleaned.indexOf('{');
            int end = cleaned.lastIndexOf('}');
            if (start >= 0 && end > start) {
                cleaned = cleaned.substring(start, end + 1);
            }

            return mapper.readValue(cleaned, Map.class);
        } catch (Exception e) {
            log.error("Gemini JSON parse hatası: {}", e.getMessage());
            return fallbackMap();
        }
    }

    private Map<String, Object> fallbackMap() {
        return Map.of(
            "reply", "Yanıt şu an üretilemiyor. Lütfen tekrar deneyin.",
            "visualInsights", "",
            "warnings", List.of(),
            "followUpQuestions", List.of("Başka bir soru sormak ister misiniz?")
        );
    }
}

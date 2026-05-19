package com.smartcart.controller;

import com.smartcart.model.dto.RecommendationResult;
import com.smartcart.service.RecommendationService;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping("/recommendations")
    public RecommendationResult getRecommendations(
            @RequestParam(required = false) String viewed,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "8") int limit
    ) {
        List<Long> viewedIds = new ArrayList<>();
        if (viewed != null && !viewed.isBlank()) {
            for (String s : viewed.split(",")) {
                try {
                    viewedIds.add(Long.parseLong(s.trim()));
                } catch (NumberFormatException ignored) {}
            }
        }
        return recommendationService.recommend(viewedIds, category, limit);
    }
}

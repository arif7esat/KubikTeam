package com.smartcart.service;

import com.smartcart.model.dto.*;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class AgentOrchestrator {

    private final ContextBuilderService contextBuilder;
    private final DataAnalysisService dataAnalysis;
    private final PromptBuilderService promptBuilder;
    private final GeminiService geminiService;

    public AgentOrchestrator(ContextBuilderService contextBuilder,
                             DataAnalysisService dataAnalysis,
                             PromptBuilderService promptBuilder,
                             GeminiService geminiService) {
        this.contextBuilder = contextBuilder;
        this.dataAnalysis = dataAnalysis;
        this.promptBuilder = promptBuilder;
        this.geminiService = geminiService;
    }

    public ChatResponse process(ChatRequest request) {
        ProductContext context = contextBuilder.build(request.getProductId(), request.getMessage());

        DataAnalysisResult analysisResult = dataAnalysis.analyze(context, request.getMessage());

        int matchScore = dataAnalysis.calculateMatchScore(analysisResult);

        GeminiRequest geminiRequest = promptBuilder.build(
            context, analysisResult, request.getMessage(),
            request.getHistory() != null ? request.getHistory() : List.of()
        );

        Map<String, Object> geminiResponse = geminiService.call(geminiRequest);

        ChatResponse response = new ChatResponse();

        response.setReply(getStringOrDefault(geminiResponse, "reply",
            "Yanıt üretilirken bir sorun oluştu."));

        response.setMatchScore(matchScore);

        response.setVisualInsights(getStringOrDefault(geminiResponse, "visualInsights", ""));

        List<String> allWarnings = new ArrayList<>(analysisResult.getWarnings());
        Object geminiWarnings = geminiResponse.get("warnings");
        if (geminiWarnings instanceof List) {
            for (Object w : (List<?>) geminiWarnings) {
                if (w instanceof String) allWarnings.add((String) w);
            }
        }
        response.setWarnings(allWarnings);

        List<String> followUps = new ArrayList<>();
        Object geminiFollowUps = geminiResponse.get("followUpQuestions");
        if (geminiFollowUps instanceof List) {
            for (Object q : (List<?>) geminiFollowUps) {
                if (q instanceof String) followUps.add((String) q);
            }
        }
        if (followUps.isEmpty()) {
            followUps.add("Bu ürün hakkında başka ne öğrenmek istersiniz?");
        }
        response.setFollowUpQuestions(followUps);

        response.setDataSources(analysisResult.getUsedSources());

        return response;
    }

    private String getStringOrDefault(Map<String, Object> map, String key, String defaultValue) {
        Object val = map.get(key);
        return val instanceof String ? (String) val : defaultValue;
    }
}

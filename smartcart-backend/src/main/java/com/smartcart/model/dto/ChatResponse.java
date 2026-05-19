package com.smartcart.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {

    private String reply;
    private Integer matchScore;
    private String visualInsights;
    private List<String> warnings;
    private List<String> followUpQuestions;
    private List<String> dataSources;

    public static ChatResponse fallback(String msg) {
        return new ChatResponse(
            msg,
            0,
            "",
            List.of(),
            List.of("Ürün hakkında ne öğrenmek istersiniz?"),
            List.of("Temel analiz")
        );
    }
}

package com.smartcart.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DataAnalysisResult {

    private int specScore;
    private int reviewScore;
    private int visualScore;
    private int variantScore;
    private int similarityScore;
    private int userFitScore;
    private int trustScore;
    private List<String> warnings = new ArrayList<>();
    private List<String> insights = new ArrayList<>();
    private List<String> usedSources = new ArrayList<>();
}

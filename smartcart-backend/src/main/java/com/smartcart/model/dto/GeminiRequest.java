package com.smartcart.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GeminiRequest {

    private String textPrompt;
    private String imageBase64;
    private String imageMimeType;
}

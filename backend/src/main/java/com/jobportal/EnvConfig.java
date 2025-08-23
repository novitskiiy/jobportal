package com.jobportal;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource(value = "classpath:application.properties")
public class EnvConfig {

    @Value("${spring.ai.openai.api-key:}")
    private String openAiApiKey;

    @Value("${spring.ai.openai.base-url:https://api.openai.com}")
    private String openAiBaseUrl;

    @Value("${spring.ai.ollama.base-url:http://localhost:11434}")
    private String ollamaBaseUrl;

    @Value("${spring.ai.ollama.chat.model:llama2}")
    private String ollamaChatModel;

    @Value("${spring.ai.huggingface.api-key:}")
    private String huggingFaceApiKey;

    @Value("${spring.ai.huggingface.base-url:https://api-inference.huggingface.co}")
    private String huggingFaceBaseUrl;

    @Value("${spring.ai.huggingface.model:microsoft/DialoGPT-medium}")
    private String huggingFaceModel;

    @Value("${ai.job-description.enabled:true}")
    private boolean aiJobDescriptionEnabled;

    @Value("${ai.job-description.max-length:2000}")
    private int aiJobDescriptionMaxLength;

    // Getters
    public String getOpenAiApiKey() {
        return openAiApiKey;
    }

    public String getOpenAiBaseUrl() {
        return openAiBaseUrl;
    }

    public String getOllamaBaseUrl() {
        return ollamaBaseUrl;
    }

    public String getOllamaChatModel() {
        return ollamaChatModel;
    }

    public String getHuggingFaceApiKey() {
        return huggingFaceApiKey;
    }

    public String getHuggingFaceBaseUrl() {
        return huggingFaceBaseUrl;
    }

    public String getHuggingFaceModel() {
        return huggingFaceModel;
    }

    public boolean isAiJobDescriptionEnabled() {
        return aiJobDescriptionEnabled;
    }

    public int getAiJobDescriptionMaxLength() {
        return aiJobDescriptionMaxLength;
    }
}

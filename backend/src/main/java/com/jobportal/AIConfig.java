package com.jobportal;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class AIConfig {

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

    @Value("${spring.ai.huggingface.model:gpt2}")
    private String huggingFaceModel;

    @Bean
    public WebClient webClient() {
        return WebClient.builder().build();
    }

    @Bean
    public String openAiApiKey() {
        return openAiApiKey;
    }

    @Bean
    public String openAiBaseUrl() {
        return openAiBaseUrl;
    }

    @Bean
    public String ollamaBaseUrl() {
        return ollamaBaseUrl;
    }

    @Bean
    public String ollamaChatModel() {
        return ollamaChatModel;
    }

    @Bean
    public String huggingFaceApiKey() {
        return huggingFaceApiKey;
    }

    @Bean
    public String huggingFaceBaseUrl() {
        return huggingFaceBaseUrl;
    }

    @Bean
    public String huggingFaceModel() {
        return huggingFaceModel;
    }
}

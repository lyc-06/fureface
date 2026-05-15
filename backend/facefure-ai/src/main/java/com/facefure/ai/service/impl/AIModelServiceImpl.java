package com.facefure.ai.service.impl;

import com.facefure.ai.model.dto.ChatMessageDTO;
import com.facefure.ai.service.AIModelService;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AIModelServiceImpl implements AIModelService {

    @Value("${openai.api-key:xxxxxxxxxx}")
    private String apiKey;

    @Override
    public SseEmitter streamChat(ChatMessageDTO messageDTO) {
        SseEmitter emitter = new SseEmitter();

        Thread thread = new Thread(() -> {
            try {
                OpenAiService service = new OpenAiService(apiKey);
                
                List<ChatMessage> messages = new ArrayList<>();
                messages.add(new ChatMessage("user", messageDTO.getContent()));
                
                ChatCompletionRequest completionRequest = ChatCompletionRequest.builder()
                        .model(messageDTO.getModel())
                        .messages(messages)
                        .build();

                service.streamChatCompletion(completionRequest)
                        .doOnNext(chunk -> {
                            try {
                                if (chunk.getChoices() != null && !chunk.getChoices().isEmpty()) {
                                    String content = chunk.getChoices().get(0).getMessage().getContent();
                                    if (content != null) {
                                        emitter.send(content);
                                    }
                                }
                            } catch (Exception e) {
                                log.error("发送消息失败", e);
                            }
                        })
                        .doOnComplete(() -> {
                            try {
                                emitter.complete();
                            } catch (Exception e) {
                                log.error("关闭流失败", e);
                            }
                        })
                        .doOnError(e -> {
                            try {
                                log.error("流式对话失败", e);
                                emitter.completeWithError(e);
                            } catch (Exception ex) {
                                log.error("发送错误失败", ex);
                            }
                        })
                        .blockLast();
            } catch (Exception e) {
                log.error("流式对话异常", e);
                emitter.completeWithError(e);
            }
        });
        
        thread.start();
        return emitter;
    }

    @Override
    public String chat(ChatMessageDTO messageDTO) {
        OpenAiService service = new OpenAiService(apiKey);
        
        List<ChatMessage> messages = new ArrayList<>();
        messages.add(new ChatMessage("user", messageDTO.getContent()));
        
        ChatCompletionRequest completionRequest = ChatCompletionRequest.builder()
                .model(messageDTO.getModel())
                .messages(messages)
                .build();

        return service.createChatCompletion(completionRequest)
                .getChoices().get(0).getMessage().getContent();
    }
}

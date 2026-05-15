package com.facefure.ai.service;

import com.facefure.ai.model.dto.ChatMessageDTO;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

public interface AIModelService {

    /**
     * 流式对话
     *
     * @param messageDTO 消息DTO
     * @return SSE发射器
     */
    SseEmitter streamChat(ChatMessageDTO messageDTO);

    /**
     * 非流式对话
     *
     * @param messageDTO 消息DTO
     * @return 回复内容
     */
    String chat(ChatMessageDTO messageDTO);
}

package com.facefure.ai.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.facefure.ai.model.dto.ChatMessageDTO;
import com.facefure.ai.model.vo.ChatSessionVO;
import com.facefure.ai.service.AIModelService;
import com.facefure.ai.service.ChatSessionService;
import com.facefure.common.model.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Tag(name = "AI聊天接口")
@RestController
@RequestMapping("/api/v1/ai/chat")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer")
public class AIChatController {

    private final AIModelService aiModelService;
    private final ChatSessionService chatSessionService;

    @Operation(summary = "创建会话")
    @PostMapping("/session")
    public Result<ChatSessionVO> createSession(@Parameter(description = "模型名称") @RequestParam String model) {
        return Result.success(chatSessionService.createSession(model));
    }

    @Operation(summary = "获取会话详情")
    @GetMapping("/session/{sessionId}")
    public Result<ChatSessionVO> getSessionDetail(@Parameter(description = "会话ID") @PathVariable Long sessionId) {
        return Result.success(chatSessionService.getSessionDetail(sessionId));
    }

    @Operation(summary = "获取会话列表")
    @GetMapping("/session/list")
    public Result<Page<ChatSessionVO>> listSessions(
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") Integer page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") Integer size) {
        return Result.success(chatSessionService.listSessions(page, size));
    }

    @Operation(summary = "删除会话")
    @DeleteMapping("/session/{sessionId}")
    public Result<Void> deleteSession(@Parameter(description = "会话ID") @PathVariable Long sessionId) {
        chatSessionService.deleteSession(sessionId);
        return Result.success();
    }

    @Operation(summary = "发送消息（流式响应）")
    @PostMapping(value = "/message/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamChat(@RequestBody @Valid ChatMessageDTO messageDTO) {
        return aiModelService.streamChat(messageDTO);
    }

    @Operation(summary = "发送消息（普通响应）")
    @PostMapping("/message")
    public Result<String> chat(@RequestBody @Valid ChatMessageDTO messageDTO) {
        return Result.success(aiModelService.chat(messageDTO));
    }
}

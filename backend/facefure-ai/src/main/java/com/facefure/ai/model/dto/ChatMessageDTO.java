package com.facefure.ai.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "聊天消息DTO")
public class ChatMessageDTO {
    
    @Schema(description = "会话ID")
    private Long sessionId;
    
    @NotBlank(message = "消息内容不能为空")
    @Schema(description = "消息内容")
    private String content;
    
    @Schema(description = "模型名称")
    private String model;
}

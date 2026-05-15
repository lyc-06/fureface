package com.facefure.ai.model.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Schema(description = "聊天会话VO")
public class ChatSessionVO {
    
    @Schema(description = "会话ID")
    private Long id;
    
    @Schema(description = "会话标题")
    private String title;
    
    @Schema(description = "使用的模型")
    private String model;
    
    @Schema(description = "会话状态")
    private Integer status;
    
    @Schema(description = "聊天记录")
    private List<ChatMessageVO> messages;
    
    @Schema(description = "创建时间")
    private LocalDateTime createTime;
    
    @Schema(description = "更新时间")
    private LocalDateTime updateTime;
}

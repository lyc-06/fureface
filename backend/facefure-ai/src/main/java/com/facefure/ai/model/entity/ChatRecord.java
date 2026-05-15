package com.facefure.ai.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("chat_record")
public class ChatRecord {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Long sessionId;
    
    private String role;
    
    private String content;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
    
    @TableLogic
    private Integer deleted;
}

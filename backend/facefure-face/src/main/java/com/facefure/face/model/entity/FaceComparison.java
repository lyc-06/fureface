package com.facefure.face.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("face_comparison")
public class FaceComparison {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Long userId;
    
    private String sourceImageUrl;
    
    private String targetImageUrl;
    
    private Double similarity;
    
    private Integer status;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
    
    @TableLogic
    private Integer deleted;
}

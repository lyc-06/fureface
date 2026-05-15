package com.facefure.face.model.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Schema(description = "人脸对比结果VO")
public class FaceComparisonVO {
    
    @Schema(description = "记录ID")
    private Long id;
    
    @Schema(description = "源图片URL")
    private String sourceImageUrl;
    
    @Schema(description = "目标图片URL")
    private String targetImageUrl;
    
    @Schema(description = "相似度")
    private Double similarity;
    
    @Schema(description = "状态（0：成功，1：失败）")
    private Integer status;
    
    @Schema(description = "创建时间")
    private LocalDateTime createTime;
}

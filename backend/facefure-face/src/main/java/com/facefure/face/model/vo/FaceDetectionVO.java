package com.facefure.face.model.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Schema(description = "人脸检测结果VO")
public class FaceDetectionVO {
    
    @Schema(description = "记录ID")
    private Long id;
    
    @Schema(description = "图片URL")
    private String imageUrl;
    
    @Schema(description = "检测到的人脸数量")
    private Integer faceCount;
    
    @Schema(description = "人脸特征")
    private String faceFeatures;
    
    @Schema(description = "状态（0：成功，1：失败）")
    private Integer status;
    
    @Schema(description = "创建时间")
    private LocalDateTime createTime;
}

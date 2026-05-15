package com.facefure.face.service;

import com.facefure.face.model.vo.FaceComparisonVO;
import org.springframework.web.multipart.MultipartFile;

public interface FaceComparisonService {

    /**
     * 人脸对比
     *
     * @param sourceFile 源图片
     * @param targetFile 目标图片
     * @return 对比结果
     */
    FaceComparisonVO compareFaces(MultipartFile sourceFile, MultipartFile targetFile);

    /**
     * 获取对比记录
     *
     * @param comparisonId 对比记录ID
     * @return 对比记录
     */
    FaceComparisonVO getComparisonRecord(Long comparisonId);

    /**
     * 删除对比记录
     *
     * @param comparisonId 对比记录ID
     */
    void deleteComparisonRecord(Long comparisonId);
}

package com.facefure.face.service;

import com.facefure.face.model.vo.FaceDetectionVO;
import org.springframework.web.multipart.MultipartFile;

public interface FaceDetectionService {

    /**
     * 人脸检测和特征提取
     *
     * @param file 图片文件
     * @return 检测结果
     */
    FaceDetectionVO detectFace(MultipartFile file);

    /**
     * 获取检测记录
     *
     * @param recordId 记录ID
     * @return 检测记录
     */
    FaceDetectionVO getDetectionRecord(Long recordId);

    /**
     * 删除检测记录
     *
     * @param recordId 记录ID
     */
    void deleteDetectionRecord(Long recordId);
}

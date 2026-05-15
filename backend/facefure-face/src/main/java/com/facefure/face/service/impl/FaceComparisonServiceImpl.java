package com.facefure.face.service.impl;

import com.facefure.common.exception.BusinessException;
import com.facefure.face.mapper.FaceComparisonMapper;
import com.facefure.face.model.entity.FaceComparison;
import com.facefure.face.model.entity.FaceRecord;
import com.facefure.face.model.vo.FaceComparisonVO;
import com.facefure.face.service.FaceComparisonService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bytedeco.opencv.opencv_core.*;
import org.bytedeco.opencv.opencv_face.FaceRecognizer;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import static org.bytedeco.opencv.global.opencv_imgcodecs.IMREAD_COLOR;
import static org.bytedeco.opencv.global.opencv_imgcodecs.imread;
import static org.bytedeco.opencv.global.opencv_imgproc.COLOR_BGR2GRAY;
import static org.bytedeco.opencv.global.opencv_imgproc.cvtColor;

@Slf4j
@Service
@RequiredArgsConstructor
public class FaceComparisonServiceImpl implements FaceComparisonService {

    private final FaceComparisonMapper faceComparisonMapper;
    private final FaceRecognizer faceRecognizer;

    @Override
    public FaceComparisonVO compareFaces(FaceRecord source, FaceRecord target) {
        try {
            // 加载源图片和目标图片的特征
            Mat sourceFace = Mat.parse(source.getFaceFeatures());
            Mat targetFace = Mat.parse(target.getFaceFeatures());

            // 计算相似度
            double similarity = calculateSimilarity(sourceFace, targetFace);

            // 保存比对记录
            FaceComparison comparison = new FaceComparison();
            comparison.setSourceRecordId(source.getId());
            comparison.setTargetRecordId(target.getId());
            comparison.setSimilarity(similarity);
            comparison.setStatus(similarity >= 0.8 ? 1 : 0); // 相似度大于0.8认为是同一个人
            faceComparisonMapper.insert(comparison);

            // 返回结果
            FaceComparisonVO vo = new FaceComparisonVO();
            BeanUtils.copyProperties(comparison, vo);
            return vo;
        } catch (Exception e) {
            log.error("人脸比对失败", e);
            throw new BusinessException("人脸比对失败: " + e.getMessage());
        }
    }

    @Override
    public FaceComparisonVO getComparisonResult(Long comparisonId) {
        FaceComparison comparison = faceComparisonMapper.selectById(comparisonId);
        if (comparison == null) {
            throw new BusinessException("比对记录不存在");
        }

        FaceComparisonVO vo = new FaceComparisonVO();
        BeanUtils.copyProperties(comparison, vo);
        return vo;
    }

    /**
     * 计算两个人脸特征向量的相似度
     */
    private double calculateSimilarity(Mat face1, Mat face2) {
        if (face1.empty() || face2.empty()) {
            throw new BusinessException("人脸特征为空");
        }

        // 使用余弦相似度计算
        double dotProduct = 0.0;
        double norm1 = 0.0;
        double norm2 = 0.0;
        int size = (int) face1.total();

        FloatBuffer buffer1 = face1.createBuffer();
        FloatBuffer buffer2 = face2.createBuffer();

        for (int i = 0; i < size; i++) {
            float val1 = buffer1.get(i);
            float val2 = buffer2.get(i);
            dotProduct += val1 * val2;
            norm1 += val1 * val1;
            norm2 += val2 * val2;
        }

        return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    }
}

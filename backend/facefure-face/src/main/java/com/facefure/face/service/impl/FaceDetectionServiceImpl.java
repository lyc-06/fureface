package com.facefure.face.service.impl;

import com.facefure.common.exception.BusinessException;
import com.facefure.common.utils.SecurityUtils;
import com.facefure.face.mapper.FaceRecordMapper;
import com.facefure.face.model.entity.FaceRecord;
import com.facefure.face.model.vo.FaceDetectionVO;
import com.facefure.face.service.FaceDetectionService;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bytedeco.javacpp.DoublePointer;
import org.bytedeco.opencv.global.opencv_imgcodecs;
import org.bytedeco.opencv.opencv_core.*;
import org.bytedeco.opencv.opencv_face.FaceRecognizer;
import org.bytedeco.opencv.opencv_objdetect.CascadeClassifier;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.InputStream;
import java.util.UUID;

import static org.bytedeco.opencv.global.opencv_imgcodecs.IMREAD_COLOR;
import static org.bytedeco.opencv.global.opencv_imgcodecs.imread;
import static org.bytedeco.opencv.global.opencv_imgproc.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class FaceDetectionServiceImpl implements FaceDetectionService {

    private final FaceRecordMapper faceRecordMapper;
    private final MinioClient minioClient;
    private final CascadeClassifier faceDetector;
    private final FaceRecognizer faceRecognizer;

    @Override
    public FaceDetectionVO detectFace(MultipartFile file) {
        try {
            // 保存文件到临时目录
            String tempFilePath = System.getProperty("java.io.tmpdir") + UUID.randomUUID() + 
                    file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));
            file.transferTo(new File(tempFilePath));

            // 读取图片
            Mat image = imread(tempFilePath, IMREAD_COLOR);
            if (image.empty()) {
                throw new BusinessException("无法读取图片");
            }

            // 转换为灰度图
            Mat grayImage = new Mat();
            cvtColor(image, grayImage, COLOR_BGR2GRAY);

            // 检测人脸
            RectVector faces = new RectVector();
            faceDetector.detectMultiScale(grayImage, faces);

            if (faces.empty()) {
                throw new BusinessException("未检测到人脸");
            }

            // 提取特征
            Mat faceFeatures = new Mat();
            Rect faceRect = faces.get(0);
            Mat face = new Mat(grayImage, faceRect);
            resize(face, face, new Size(150, 150));
            faceRecognizer.predict(face, new IntPointer(1), new DoublePointer(1));

            // 上传图片到MinIO
            String fileName = UUID.randomUUID() + file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));
            try (InputStream inputStream = file.getInputStream()) {
                minioClient.putObject(
                    PutObjectArgs.builder()
                        .bucket("faces")
                        .object(fileName)
                        .stream(inputStream, file.getSize(), -1)
                        .contentType(file.getContentType())
                        .build()
                );
            }

            // 保存记录
            FaceRecord record = new FaceRecord();
            record.setUserId(SecurityUtils.getCurrentUserId());
            record.setImageUrl("/faces/" + fileName);
            record.setFaceCount((int) faces.size());
            record.setFaceFeatures(faceFeatures.toString());
            record.setStatus(0);
            faceRecordMapper.insert(record);

            // 返回结果
            FaceDetectionVO vo = new FaceDetectionVO();
            BeanUtils.copyProperties(record, vo);
            return vo;
        } catch (Exception e) {
            log.error("人脸检测失败", e);
            throw new BusinessException("人脸检测失败: " + e.getMessage());
        }
    }

    @Override
    public FaceDetectionVO getDetectionRecord(Long recordId) {
        FaceRecord record = faceRecordMapper.selectById(recordId);
        if (record == null) {
            throw new BusinessException("记录不存在");
        }

        // 验证权限
        if (!record.getUserId().equals(SecurityUtils.getCurrentUserId())) {
            throw new BusinessException("无权访问该记录");
        }

        FaceDetectionVO vo = new FaceDetectionVO();
        BeanUtils.copyProperties(record, vo);
        return vo;
    }

    @Override
    public void deleteDetectionRecord(Long recordId) {
        FaceRecord record = faceRecordMapper.selectById(recordId);
        if (record == null) {
            throw new BusinessException("记录不存在");
        }

        // 验证权限
        if (!record.getUserId().equals(SecurityUtils.getCurrentUserId())) {
            throw new BusinessException("无权删除该记录");
        }

        faceRecordMapper.deleteById(recordId);
    }
}

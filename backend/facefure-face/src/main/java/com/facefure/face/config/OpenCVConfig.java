package com.facefure.face.config;

import org.bytedeco.opencv.opencv_face.FaceRecognizer;
import org.bytedeco.opencv.opencv_objdetect.CascadeClassifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import static org.bytedeco.opencv.global.opencv_face.createLBPHFaceRecognizer;

@Configuration
public class OpenCVConfig {

    @Bean
    public CascadeClassifier faceDetector() {
        // 加载OpenCV的人脸检测分类器
        CascadeClassifier faceDetector = new CascadeClassifier();
        faceDetector.load("haarcascade_frontalface_default.xml");
        return faceDetector;
    }

    @Bean
    public FaceRecognizer faceRecognizer() {
        // 创建LBPH人脸识别器
        return createLBPHFaceRecognizer();
    }
}

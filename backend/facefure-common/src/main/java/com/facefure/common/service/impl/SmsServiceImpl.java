package com.facefure.common.service.impl;

import com.aliyun.dysmsapi20170525.Client;
import com.aliyun.dysmsapi20170525.models.SendSmsRequest;
import com.facefure.common.exception.BusinessException;
import com.facefure.common.service.SmsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class SmsServiceImpl implements SmsService {

    @Value("${aliyun.sms.access-key-id:xxxxxxxxxx}")
    private String accessKeyId;

    @Value("${aliyun.sms.access-key-secret:xxxxxxxxxx}")
    private String accessKeySecret;

    @Value("${aliyun.sms.sign-name:xxxxxxxxxx}")
    private String signName;

    @Value("${aliyun.sms.template-code:xxxxxxxxxx}")
    private String templateCode;

    @Override
    public void sendVerificationCode(String phone, String code) {
        try {
            // 模拟发送短信
            log.info("模拟发送短信验证码");
            log.info("手机号: {}", phone);
            log.info("验证码: {}", code);
            log.info("签名名称: {}", signName);
            log.info("模板代码: {}", templateCode);
            
            // 实际生产环境中，取消注释以下代码并配置正确的密钥信息
            /*
            Config config = new Config()
                    .setAccessKeyId(accessKeyId)
                    .setAccessKeySecret(accessKeySecret)
                    .setEndpoint("dysmsapi.aliyuncs.com");
            
            Client client = new Client(config);
            
            SendSmsRequest request = new SendSmsRequest()
                    .setPhoneNumbers(phone)
                    .setSignName(signName)
                    .setTemplateCode(templateCode)
                    .setTemplateParam("{\"code\":\"" + code + "\"}");

            client.sendSms(request);
            */
            
            log.info("验证码发送成功，手机号：{}，验证码：{}", phone, code);
        } catch (Exception e) {
            log.error("验证码发送失败", e);
            throw new BusinessException("验证码发送失败");
        }
    }
}

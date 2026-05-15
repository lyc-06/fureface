package com.facefure.common.config;

import com.aliyun.teaopenapi.models.Config;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "aliyun.sms")
public class SmsConfig {

    private String accessKeyId;
    private String accessKeySecret;
    private String endpoint;
    private String signName;
    private String templateCode;

    @Bean
    public com.aliyun.dysmsapi20170525.Client smsClient() throws Exception {
        Config config = new Config()
                .setAccessKeyId(accessKeyId)
                .setAccessKeySecret(accessKeySecret)
                .setEndpoint(endpoint);
        return new com.aliyun.dysmsapi20170525.Client(config);
    }
}

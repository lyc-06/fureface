package com.facefure.ai;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@EnableDiscoveryClient
@MapperScan("com.facefure.ai.mapper")
@ComponentScan({"com.facefure.ai", "com.facefure.common"})
public class AIApplication {
    public static void main(String[] args) {
        SpringApplication.run(AIApplication.class, args);
    }
}

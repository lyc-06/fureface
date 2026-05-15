package com.facefure.common.service.impl;

import com.facefure.common.exception.BusinessException;
import com.facefure.common.service.EmailService;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${spring.mail.username:xxxxxxxxxx@qq.com}")
    private String from;

    @Override
    public void sendVerificationCode(String to, String code) {
        try {
            // 模拟发送邮件
            log.info("模拟发送邮件验证码");
            log.info("发件人: {}", from);
            log.info("收件人: {}", to);
            log.info("验证码: {}", code);
            
            // 实际生产环境中，取消注释以下代码并配置正确的邮箱信息
            /*
            Context context = new Context();
            context.setVariable("code", code);
            String content = templateEngine.process("mail/verification-code", context);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject("验证码");
            helper.setText(content, true);

            mailSender.send(message);
            */
            
            log.info("验证码邮件发送成功，收件人：{}，验证码：{}", to, code);
        } catch (Exception e) {
            log.error("验证码邮件发送失败", e);
            throw new BusinessException("验证码邮件发送失败");
        }
    }
}

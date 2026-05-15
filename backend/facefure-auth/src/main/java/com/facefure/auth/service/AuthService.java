package com.facefure.auth.service;

import com.facefure.auth.model.dto.LoginDTO;
import com.facefure.auth.model.dto.RegisterDTO;
import com.facefure.auth.model.vo.LoginVO;

public interface AuthService {
    
    /**
     * 用户登录
     */
    LoginVO login(LoginDTO loginDTO);

    /**
     * 用户注册
     */
    LoginVO register(RegisterDTO registerDTO);

    /**
     * 发送验证码
     */
    void sendVerifyCode(String contact, String type);

    /**
     * 刷新令牌
     */
    LoginVO refreshToken(String refreshToken);

    /**
     * 退出登录
     */
    void logout();
}

package com.facefure.auth.model.vo;

import lombok.Data;

@Data
public class LoginVO {
    private String token;
    private String refreshToken;
    private Long expiresIn;
    private UserVO userInfo;
}

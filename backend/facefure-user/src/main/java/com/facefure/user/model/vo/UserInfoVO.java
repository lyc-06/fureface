package com.facefure.user.model.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserInfoVO {
    private Long id;
    private String username;
    private String nickname;
    private String avatar;
    private String phone;
    private String email;
    private String gender;
    private LocalDateTime lastLoginTime;
    private LocalDateTime createTime;
}

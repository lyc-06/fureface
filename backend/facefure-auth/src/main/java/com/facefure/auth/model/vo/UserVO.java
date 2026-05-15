package com.facefure.auth.model.vo;

import lombok.Data;

@Data
public class UserVO {
    private Long id;
    private String username;
    private String nickname;
    private String avatar;
    private String phone;
    private String email;
    private String gender;
}

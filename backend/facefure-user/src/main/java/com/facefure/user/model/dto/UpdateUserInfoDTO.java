package com.facefure.user.model.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UpdateUserInfoDTO {
    private String nickname;

    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    private String phone;

    @Email(message = "邮箱格式不正确")
    private String email;

    @Pattern(regexp = "^(男|女|保密)$", message = "性别只能是男、女或保密")
    private String gender;
}

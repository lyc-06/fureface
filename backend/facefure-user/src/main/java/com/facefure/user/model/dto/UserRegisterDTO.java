package com.facefure.user.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
@Schema(description = "用户注册DTO")
public class UserRegisterDTO {

    @NotBlank(message = "用户名不能为空")
    @Pattern(regexp = "^[a-zA-Z0-9]{4,16}$", message = "用户名必须为4-16位字母或数字")
    @Schema(description = "用户名")
    private String username;

    @NotBlank(message = "密码不能为空")
    @Pattern(regexp = "^[a-zA-Z0-9]{6,16}$", message = "密码必须为6-16位字母或数字")
    @Schema(description = "密码")
    private String password;

    @NotBlank(message = "确认密码不能为空")
    @Schema(description = "确认密码")
    private String confirmPassword;

    @NotBlank(message = "手机号不能为空")
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    @Schema(description = "手机号")
    private String phone;

    @NotBlank(message = "验证码不能为空")
    @Schema(description = "验证码")
    private String code;
}

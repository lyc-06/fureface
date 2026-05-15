package com.facefure.user.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.facefure.common.model.Result;
import com.facefure.user.model.dto.*;
import com.facefure.user.model.vo.UserInfoVO;
import com.facefure.user.model.vo.UserTokenVO;
import com.facefure.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Tag(name = "用户接口")
@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer")
public class UserController {

    private final UserService userService;

    @Operation(summary = "用户注册")
    @PostMapping("/register")
    public Result<Void> register(@RequestBody @Valid UserRegisterDTO registerDTO) {
        userService.register(registerDTO);
        return Result.success();
    }

    @Operation(summary = "用户登录")
    @PostMapping("/login")
    public Result<UserTokenVO> login(@RequestBody @Valid UserLoginDTO loginDTO) {
        return Result.success(userService.login(loginDTO));
    }

    @Operation(summary = "获取用户信息")
    @GetMapping("/info")
    public Result<UserInfoVO> getUserInfo() {
        return Result.success(userService.getUserInfo());
    }

    @Operation(summary = "更新用户信息")
    @PutMapping("/info")
    public Result<UserInfoVO> updateUserInfo(@RequestBody @Valid UpdateUserInfoDTO userInfoDTO) {
        return Result.success(userService.updateUserInfo(userInfoDTO));
    }

    @Operation(summary = "更新用户头像")
    @PostMapping("/avatar")
    public Result<String> updateAvatar(@RequestParam("file") MultipartFile file) {
        return Result.success(userService.updateAvatar(file));
    }

    @Operation(summary = "修改密码")
    @PutMapping("/password")
    public Result<Void> updatePassword(@RequestBody @Valid UpdatePasswordDTO passwordDTO) {
        userService.updatePassword(passwordDTO);
        return Result.success();
    }

    @Operation(summary = "绑定手机号")
    @PostMapping("/phone/bind")
    public Result<Void> bindPhone(@RequestParam String phone, @RequestParam String code) {
        userService.bindPhone(phone, code);
        return Result.success();
    }

    @Operation(summary = "绑定邮箱")
    @PostMapping("/email/bind")
    public Result<Void> bindEmail(@RequestParam String email, @RequestParam String code) {
        userService.bindEmail(email, code);
        return Result.success();
    }

    @Operation(summary = "发送手机验证码")
    @PostMapping("/phone/code")
    public Result<Void> sendPhoneCode(@RequestParam String phone) {
        userService.sendPhoneCode(phone);
        return Result.success();
    }

    @Operation(summary = "发送邮箱验证码")
    @PostMapping("/email/code")
    public Result<Void> sendEmailCode(@RequestParam String email) {
        userService.sendEmailCode(email);
        return Result.success();
    }

    @Operation(summary = "搜索用户")
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Page<UserInfoVO>> searchUsers(
            @Parameter(description = "搜索关键词") @RequestParam(required = false) String keyword,
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") Integer page,
            @Parameter(description = "每页数量") @RequestParam(defaultValue = "10") Integer size) {
        return Result.success(userService.searchUsers(keyword, page, size));
    }

    @Operation(summary = "更新用户状态")
    @PutMapping("/{userId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> updateStatus(
            @Parameter(description = "用户ID") @PathVariable Long userId,
            @Parameter(description = "状态（0：正常，1：禁用）") @RequestParam Integer status) {
        userService.updateStatus(userId, status);
        return Result.success();
    }

    @Operation(summary = "刷新Token")
    @PostMapping("/token/refresh")
    public Result<UserTokenVO> refreshToken(@RequestParam String refreshToken) {
        return Result.success(userService.refreshToken(refreshToken));
    }
}
}

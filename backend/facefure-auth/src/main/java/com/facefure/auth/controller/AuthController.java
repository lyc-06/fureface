package com.facefure.auth.controller;

import com.facefure.auth.model.dto.LoginDTO;
import com.facefure.auth.model.dto.RegisterDTO;
import com.facefure.auth.model.vo.LoginVO;
import com.facefure.auth.service.AuthService;
import com.facefure.common.model.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "认证接口")
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;

    @Operation(summary = "用户登录")
    @PostMapping("/login")
    public Result<LoginVO> login(@RequestBody @Valid LoginDTO loginDTO) {
        return Result.success(authService.login(loginDTO));
    }

    @Operation(summary = "用户注册")
    @PostMapping("/register")
    public Result<LoginVO> register(@RequestBody @Valid RegisterDTO registerDTO) {
        return Result.success(authService.register(registerDTO));
    }

    @Operation(summary = "获取验证码")
    @PostMapping("/code/send")
    public Result<Void> sendVerifyCode(@RequestParam String contact, @RequestParam String type) {
        authService.sendVerifyCode(contact, type);
        return Result.success();
    }

    @Operation(summary = "刷新令牌")
    @PostMapping("/token/refresh")
    public Result<LoginVO> refreshToken(@RequestParam String refreshToken) {
        return Result.success(authService.refreshToken(refreshToken));
    }

    @Operation(summary = "退出登录")
    @PostMapping("/logout")
    public Result<Void> logout() {
        authService.logout();
        return Result.success();
    }
}

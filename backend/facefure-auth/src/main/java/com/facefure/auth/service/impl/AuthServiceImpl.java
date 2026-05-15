package com.facefure.auth.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.facefure.auth.mapper.UserMapper;
import com.facefure.auth.model.dto.LoginDTO;
import com.facefure.auth.model.dto.RegisterDTO;
import com.facefure.auth.model.entity.User;
import com.facefure.auth.model.vo.LoginVO;
import com.facefure.auth.model.vo.UserVO;
import com.facefure.auth.service.AuthService;
import com.facefure.common.constants.Constants;
import com.facefure.common.exception.BusinessException;
import com.facefure.common.utils.JwtUtils;
import com.facefure.common.utils.RedisUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserMapper userMapper;
    private final JwtUtils jwtUtils;
    private final RedisUtils redisUtils;
    private final PasswordEncoder passwordEncoder;

    @Override
    public LoginVO login(LoginDTO loginDTO) {
        // 校验验证码
        if (loginDTO.getVerifyCode() != null) {
            String cacheCode = (String) redisUtils.get(Constants.VERIFY_CODE_PREFIX + loginDTO.getUsername());
            if (!loginDTO.getVerifyCode().equals(cacheCode)) {
                throw new BusinessException("验证码错误");
            }
        }

        // 查询用户
        User user = userMapper.selectOne(
            new LambdaQueryWrapper<User>()
                .eq(User::getUsername, loginDTO.getUsername())
        );

        if (user == null) {
            throw new BusinessException("用户不存在");
        }

        // 校验密码
        if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            throw new BusinessException("密码错误");
        }

        // 更新登录时间
        user.setLastLoginTime(LocalDateTime.now());
        userMapper.updateById(user);

        // 生成token
        return generateToken(user);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public LoginVO register(RegisterDTO registerDTO) {
        // 校验验证码
        String cacheCode = (String) redisUtils.get(Constants.VERIFY_CODE_PREFIX + registerDTO.getUsername());
        if (!registerDTO.getVerifyCode().equals(cacheCode)) {
            throw new BusinessException("验证码错误");
        }

        // 校验两次密码是否一致
        if (!registerDTO.getPassword().equals(registerDTO.getConfirmPassword())) {
            throw new BusinessException("两次密码不一致");
        }

        // 检查用户名是否已存在
        if (userMapper.selectCount(
            new LambdaQueryWrapper<User>()
                .eq(User::getUsername, registerDTO.getUsername())
        ) > 0) {
            throw new BusinessException("用户名已存在");
        }

        // 创建用户
        User user = new User();
        user.setUsername(registerDTO.getUsername());
        user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
        user.setNickname(registerDTO.getNickname());
        user.setAvatar(Constants.DEFAULT_AVATAR);
        user.setStatus(1);
        user.setLastLoginTime(LocalDateTime.now());
        userMapper.insert(user);

        // 生成token
        return generateToken(user);
    }

    @Override
    public void sendVerifyCode(String contact, String type) {
        // 生成6位验证码
        String code = String.format("%06d", (int) (Math.random() * 1000000));
        
        // 保存验证码到Redis
        redisUtils.set(
            Constants.VERIFY_CODE_PREFIX + contact,
            code,
            Constants.VERIFY_CODE_EXPIRE,
            TimeUnit.MINUTES
        );

        // TODO: 根据type发送验证码到手机或邮箱
    }

    @Override
    public LoginVO refreshToken(String refreshToken) {
        // 验证refreshToken
        if (!jwtUtils.validateToken(refreshToken)) {
            throw new BusinessException("refresh token已过期");
        }

        // 获取用户信息
        Long userId = jwtUtils.getUserIdFromToken(refreshToken);
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }

        // 生成新token
        return generateToken(user);
    }

    @Override
    public void logout() {
        // TODO: 可以实现token黑名单等逻辑
    }

    private LoginVO generateToken(User user) {
        String token = jwtUtils.generateToken(user.getId(), user.getUsername());
        String refreshToken = UUID.randomUUID().toString();

        LoginVO loginVO = new LoginVO();
        loginVO.setToken(token);
        loginVO.setRefreshToken(refreshToken);
        loginVO.setExpiresIn(7200L); // token有效期2小时

        UserVO userVO = new UserVO();
        BeanUtils.copyProperties(user, userVO);
        loginVO.setUserInfo(userVO);

        return loginVO;
    }
}

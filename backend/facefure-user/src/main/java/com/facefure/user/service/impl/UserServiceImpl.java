package com.facefure.user.service.impl;

import com.facefure.common.constants.Constants;
import com.facefure.common.exception.BusinessException;
import com.facefure.common.utils.RedisUtils;
import com.facefure.common.utils.SecurityUtils;
import com.facefure.user.mapper.UserMapper;
import com.facefure.user.model.dto.UpdatePasswordDTO;
import com.facefure.user.model.dto.UpdateUserInfoDTO;
import com.facefure.user.model.entity.User;
import com.facefure.user.model.vo.UserInfoVO;
import com.facefure.user.service.UserService;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final RedisUtils redisUtils;
    private final PasswordEncoder passwordEncoder;
    private final MinioClient minioClient;
    private final SmsService smsService;
    private final EmailService emailService;

    @Override
    public UserInfoVO getUserInfo() {
        User user = userMapper.selectById(SecurityUtils.getCurrentUserId());
        if (user == null) {
            throw new BusinessException("用户不存在");
        }

        UserInfoVO userInfoVO = new UserInfoVO();
        BeanUtils.copyProperties(user, userInfoVO);
        return userInfoVO;
    }

    @Override
    public UserInfoVO updateUserInfo(UpdateUserInfoDTO userInfoDTO) {
        User user = userMapper.selectById(SecurityUtils.getCurrentUserId());
        if (user == null) {
            throw new BusinessException("用户不存在");
        }

        BeanUtils.copyProperties(userInfoDTO, user);
        userMapper.updateById(user);

        UserInfoVO userInfoVO = new UserInfoVO();
        BeanUtils.copyProperties(user, userInfoVO);
        return userInfoVO;
    }

    @Override
    public String updateAvatar(MultipartFile file) {
        try {
            String fileName = UUID.randomUUID().toString() + 
                file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));
            
            // 上传到MinIO
            try (InputStream inputStream = file.getInputStream()) {
                minioClient.putObject(
                    PutObjectArgs.builder()
                        .bucket("avatars")
                        .object(fileName)
                        .stream(inputStream, file.getSize(), -1)
                        .contentType(file.getContentType())
                        .build()
                );
            }

            // 更新用户头像
            String avatarUrl = "/avatars/" + fileName;
            User user = userMapper.selectById(SecurityUtils.getCurrentUserId());
            user.setAvatar(avatarUrl);
            userMapper.updateById(user);

            return avatarUrl;
        } catch (Exception e) {
            log.error("头像上传失败", e);
            throw new BusinessException("头像上传失败");
        }
    }

    @Override
    public void updatePassword(UpdatePasswordDTO passwordDTO) {
        if (!passwordDTO.getNewPassword().equals(passwordDTO.getConfirmPassword())) {
            throw new BusinessException("两次密码不一致");
        }

        User user = userMapper.selectById(SecurityUtils.getCurrentUserId());
        if (!passwordEncoder.matches(passwordDTO.getOldPassword(), user.getPassword())) {
            throw new BusinessException("原密码错误");
        }

        user.setPassword(passwordEncoder.encode(passwordDTO.getNewPassword()));
        userMapper.updateById(user);
    }

    @Override
    public void bindPhone(String phone, String code) {
        String cacheCode = (String) redisUtils.get(Constants.VERIFY_CODE_PREFIX + phone);
        if (!code.equals(cacheCode)) {
            throw new BusinessException("验证码错误");
        }

        User user = userMapper.selectById(SecurityUtils.getCurrentUserId());
        user.setPhone(phone);
        userMapper.updateById(user);
    }

    @Override
    public void bindEmail(String email, String code) {
        String cacheCode = (String) redisUtils.get(Constants.VERIFY_CODE_PREFIX + email);
        if (!code.equals(cacheCode)) {
            throw new BusinessException("验证码错误");
        }

        User user = userMapper.selectById(SecurityUtils.getCurrentUserId());
        user.setEmail(email);
        userMapper.updateById(user);
    }

    @Override
    public void sendPhoneCode(String phone) {
        // 生成6位随机验证码
        String code = String.format("%06d", new Random().nextInt(1000000));
        
        // 发送验证码
        smsService.sendVerificationCode(phone, code);
        
        // 将验证码存入Redis，设置5分钟过期
        redisUtils.set(Constants.VERIFY_CODE_PREFIX + phone, code, 5, TimeUnit.MINUTES);
    }

    @Override
    public void sendEmailCode(String email) {
        // 生成6位随机验证码
        String code = String.format("%06d", new Random().nextInt(1000000));
        
        // 发送验证码
        emailService.sendVerificationCode(email, code);
        
        // 将验证码存入Redis，设置5分钟过期
        redisUtils.set(Constants.VERIFY_CODE_PREFIX + email, code, 5, TimeUnit.MINUTES);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void register(UserRegisterDTO registerDTO) {
        // 校验两次密码是否一致
        if (!registerDTO.getPassword().equals(registerDTO.getConfirmPassword())) {
            throw new BusinessException("两次密码不一致");
        }

        // 校验验证码
        String cacheCode = (String) redisUtils.get(Constants.VERIFY_CODE_PREFIX + registerDTO.getPhone());
        if (!registerDTO.getCode().equals(cacheCode)) {
            throw new BusinessException("验证码错误");
        }

        // 检查用户名是否已存在
        if (userMapper.selectCount(new LambdaQueryWrapper<User>()
                .eq(User::getUsername, registerDTO.getUsername())) > 0) {
            throw new BusinessException("用户名已存在");
        }

        // 检查手机号是否已被使用
        if (userMapper.selectCount(new LambdaQueryWrapper<User>()
                .eq(User::getPhone, registerDTO.getPhone())) > 0) {
            throw new BusinessException("手机号已被使用");
        }

        // 创建用户
        User user = new User();
        user.setUsername(registerDTO.getUsername());
        user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
        user.setPhone(registerDTO.getPhone());
        user.setNickname(registerDTO.getUsername());
        user.setStatus(0);
        userMapper.insert(user);
    }

    @Override
    public UserTokenVO login(UserLoginDTO loginDTO) {
        // 验证码校验（如果有验证码）
        if (StringUtils.hasText(loginDTO.getCaptcha()) && StringUtils.hasText(loginDTO.getCaptchaKey())) {
            String captcha = (String) redisUtils.get(Constants.CAPTCHA_PREFIX + loginDTO.getCaptchaKey());
            if (!loginDTO.getCaptcha().equalsIgnoreCase(captcha)) {
                throw new BusinessException("验证码错误");
            }
        }

        // 认证用户
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDTO.getUsername(), loginDTO.getPassword()));

        // 生成token
        User user = userMapper.selectOne(new LambdaQueryWrapper<User>()
                .eq(User::getUsername, loginDTO.getUsername()));

        String accessToken = jwtUtils.generateAccessToken(user.getId());
        String refreshToken = jwtUtils.generateRefreshToken(user.getId());

        UserTokenVO tokenVO = new UserTokenVO();
        tokenVO.setAccessToken(accessToken);
        tokenVO.setRefreshToken(refreshToken);
        tokenVO.setExpiresIn(jwtUtils.getAccessTokenExpiration());

        return tokenVO;
    }

    @Override
    public UserTokenVO refreshToken(String refreshToken) {
        // 验证刷新令牌
        Long userId = jwtUtils.validateRefreshToken(refreshToken);
        if (userId == null) {
            throw new BusinessException("无效的刷新令牌");
        }

        // 生成新的token
        String accessToken = jwtUtils.generateAccessToken(userId);
        String newRefreshToken = jwtUtils.generateRefreshToken(userId);

        UserTokenVO tokenVO = new UserTokenVO();
        tokenVO.setAccessToken(accessToken);
        tokenVO.setRefreshToken(newRefreshToken);
        tokenVO.setExpiresIn(jwtUtils.getAccessTokenExpiration());

        return tokenVO;
    }

    @Override
    public Page<UserInfoVO> searchUsers(String keyword, Integer page, Integer size) {
        // 创建分页对象
        Page<User> userPage = new Page<>(page, size);

        // 构建查询条件
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<User>()
                .and(StringUtils.hasText(keyword), q -> q
                        .like(User::getUsername, keyword)
                        .or()
                        .like(User::getNickname, keyword)
                        .or()
                        .like(User::getPhone, keyword)
                        .or()
                        .like(User::getEmail, keyword))
                .orderByDesc(User::getCreateTime);

        // 执行分页查询
        Page<User> resultPage = userMapper.selectPage(userPage, queryWrapper);

        // 转换为VO对象
        Page<UserInfoVO> voPage = new Page<>(resultPage.getCurrent(), resultPage.getSize(), resultPage.getTotal());
        voPage.setRecords(resultPage.getRecords().stream().map(user -> {
            UserInfoVO vo = new UserInfoVO();
            BeanUtils.copyProperties(user, vo);
            return vo;
        }).toList());

        return voPage;
    }

    @Override
    public void updateStatus(Long userId, Integer status) {
        // 检查用户是否存在
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }

        // 不能修改自己的状态
        if (userId.equals(SecurityUtils.getCurrentUserId())) {
            throw new BusinessException("不能修改自己的状态");
        }

        // 更新状态
        User updateUser = new User();
        updateUser.setId(userId);
        updateUser.setStatus(status);
        userMapper.updateById(updateUser);

        // 如果禁用用户，则清除该用户的token
        if (status == 1) {
            String userTokenKey = Constants.TOKEN_PREFIX + userId;
            redisUtils.delete(userTokenKey);
        }
    }

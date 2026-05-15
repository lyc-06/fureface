package com.facefure.user.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.facefure.user.model.dto.UpdatePasswordDTO;
import com.facefure.user.model.dto.UpdateUserInfoDTO;
import com.facefure.user.model.dto.UserLoginDTO;
import com.facefure.user.model.dto.UserRegisterDTO;
import com.facefure.user.model.vo.UserInfoVO;
import com.facefure.user.model.vo.UserTokenVO;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {
    
    /**
     * 用户注册
     */
    void register(UserRegisterDTO registerDTO);

    /**
     * 用户登录
     */
    UserTokenVO login(UserLoginDTO loginDTO);

    /**
     * 获取用户信息
     */
    UserInfoVO getUserInfo();

    /**
     * 更新用户信息
     */
    UserInfoVO updateUserInfo(UpdateUserInfoDTO userInfoDTO);

    /**
     * 更新用户头像
     */
    String updateAvatar(MultipartFile file);

    /**
     * 修改密码
     */
    void updatePassword(UpdatePasswordDTO passwordDTO);

    /**
     * 绑定手机号
     */
    void bindPhone(String phone, String code);

    /**
     * 绑定邮箱
     */
    void bindEmail(String email, String code);

    /**
     * 发送手机验证码
     */
    void sendPhoneCode(String phone);

    /**
     * 发送邮箱验证码
     */
    void sendEmailCode(String email);

    /**
     * 搜索用户
     */
    Page<UserInfoVO> searchUsers(String keyword, Integer page, Integer size);

    /**
     * 更新用户状态
     */
    void updateStatus(Long userId, Integer status);

    /**
     * 刷新Token
     */
    UserTokenVO refreshToken(String refreshToken);
}

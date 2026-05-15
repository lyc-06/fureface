package com.facefure.common.constants;

public class Constants {
    
    /**
     * 验证码前缀
     */
    public static final String VERIFY_CODE_PREFIX = "verify_code:";
    
    /**
     * 验证码有效期（分钟）
     */
    public static final int VERIFY_CODE_EXPIRE = 5;
    
    /**
     * 用户token前缀
     */
    public static final String TOKEN_PREFIX = "Bearer ";
    
    /**
     * 用户token在header中的名字
     */
    public static final String TOKEN_HEADER = "Authorization";
    
    /**
     * 默认头像
     */
    public static final String DEFAULT_AVATAR = "default_avatar.jpg";
    
    /**
     * 默认页码
     */
    public static final int DEFAULT_PAGE_NUM = 1;
    
    /**
     * 默认分页大小
     */
    public static final int DEFAULT_PAGE_SIZE = 10;
    
    /**
     * 最大分页大小
     */
    public static final int MAX_PAGE_SIZE = 100;
}

package com.facefure.ai.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.facefure.ai.model.vo.ChatSessionVO;

public interface ChatSessionService {

    /**
     * 创建会话
     *
     * @param model 模型名称
     * @return 会话信息
     */
    ChatSessionVO createSession(String model);

    /**
     * 获取会话详情
     *
     * @param sessionId 会话ID
     * @return 会话信息
     */
    ChatSessionVO getSessionDetail(Long sessionId);

    /**
     * 获取会话列表
     *
     * @param page 页码
     * @param size 每页大小
     * @return 分页会话列表
     */
    Page<ChatSessionVO> listSessions(Integer page, Integer size);

    /**
     * 删除会话
     *
     * @param sessionId 会话ID
     */
    void deleteSession(Long sessionId);
}

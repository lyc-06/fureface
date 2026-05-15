package com.facefure.ai.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.facefure.ai.mapper.ChatRecordMapper;
import com.facefure.ai.mapper.ChatSessionMapper;
import com.facefure.ai.model.entity.ChatRecord;
import com.facefure.ai.model.entity.ChatSession;
import com.facefure.ai.model.vo.ChatMessageVO;
import com.facefure.ai.model.vo.ChatSessionVO;
import com.facefure.ai.service.ChatSessionService;
import com.facefure.common.exception.BusinessException;
import com.facefure.common.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatSessionServiceImpl implements ChatSessionService {

    private final ChatSessionMapper chatSessionMapper;
    private final ChatRecordMapper chatRecordMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ChatSessionVO createSession(String model) {
        ChatSession session = new ChatSession();
        session.setUserId(SecurityUtils.getCurrentUserId());
        session.setTitle("新的对话");
        session.setModel(model);
        session.setStatus(0);
        
        chatSessionMapper.insert(session);

        ChatSessionVO vo = new ChatSessionVO();
        BeanUtils.copyProperties(session, vo);
        return vo;
    }

    @Override
    public ChatSessionVO getSessionDetail(Long sessionId) {
        ChatSession session = chatSessionMapper.selectById(sessionId);
        if (session == null) {
            throw new BusinessException("会话不存在");
        }

        // 验证权限
        if (!session.getUserId().equals(SecurityUtils.getCurrentUserId())) {
            throw new BusinessException("无权访问该会话");
        }

        // 查询聊天记录
        List<ChatRecord> records = chatRecordMapper.selectList(
                new LambdaQueryWrapper<ChatRecord>()
                        .eq(ChatRecord::getSessionId, sessionId)
                        .orderByAsc(ChatRecord::getCreateTime));

        ChatSessionVO vo = new ChatSessionVO();
        BeanUtils.copyProperties(session, vo);
        vo.setMessages(records.stream().map(record -> {
            ChatMessageVO messageVO = new ChatMessageVO();
            BeanUtils.copyProperties(record, messageVO);
            return messageVO;
        }).toList());

        return vo;
    }

    @Override
    public Page<ChatSessionVO> listSessions(Integer page, Integer size) {
        Page<ChatSession> sessionPage = chatSessionMapper.selectPage(
                new Page<>(page, size),
                new LambdaQueryWrapper<ChatSession>()
                        .eq(ChatSession::getUserId, SecurityUtils.getCurrentUserId())
                        .orderByDesc(ChatSession::getUpdateTime)
        );

        return sessionPage.convert(session -> {
            ChatSessionVO vo = new ChatSessionVO();
            BeanUtils.copyProperties(session, vo);
            return vo;
        });
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteSession(Long sessionId) {
        ChatSession session = chatSessionMapper.selectById(sessionId);
        if (session == null) {
            throw new BusinessException("会话不存在");
        }

        // 验证权限
        if (!session.getUserId().equals(SecurityUtils.getCurrentUserId())) {
            throw new BusinessException("无权删除该会话");
        }

        // 删除会话和聊天记录
        chatSessionMapper.deleteById(sessionId);
        chatRecordMapper.delete(
                new LambdaQueryWrapper<ChatRecord>()
                        .eq(ChatRecord::getSessionId, sessionId)
        );
    }
}

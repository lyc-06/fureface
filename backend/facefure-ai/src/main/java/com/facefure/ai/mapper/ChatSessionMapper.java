package com.facefure.ai.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.facefure.ai.model.entity.ChatSession;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ChatSessionMapper extends BaseMapper<ChatSession> {
}

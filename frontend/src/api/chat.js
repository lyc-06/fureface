import request from '@/utils/request'

// 发送消息
export function sendMessage(data) {
  return request({
    url: '/ai/chat',
    method: 'post',
    data
  })
}

// 获取聊天历史
export function getChatHistory(params) {
  return request({
    url: '/ai/chat/history',
    method: 'get',
    params
  })
}

// 创建新的会话
export function createSession() {
  return request({
    url: '/ai/chat/session',
    method: 'post'
  })
}

// 获取会话列表
export function getSessionList() {
  return request({
    url: '/ai/chat/sessions',
    method: 'get'
  })
}

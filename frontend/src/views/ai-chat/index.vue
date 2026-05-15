<template>
  <div class="chat-container">
    <el-card class="chat-box">
      <template #header>
        <div class="chat-header">
          <h3>AI助手</h3>
          <el-button type="primary" size="small" @click="clearChat">清空对话</el-button>
        </div>
      </template>
      
      <div class="messages" ref="messagesRef">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="['message', message.type]"
        >
          <el-avatar
            :size="40"
            :src="message.type === 'user' ? '/src/assets/默认头像.jpeg' : '/src/assets/ai-avatar.png'"
          />
          <div class="message-content">
            <p v-html="formatMessage(message.content)"></p>
            <span class="time">{{ formatTime(message.time) }}</span>
          </div>
        </div>
      </div>

      <div class="input-area">
        <el-input
          v-model="inputMessage"
          type="textarea"
          :rows="3"
          placeholder="输入消息..."
          @keyup.enter.exact="sendMessage"
        />
        <el-button type="primary" :loading="loading" @click="sendMessage">
          发送
          <template #icon>
            <el-icon><Promotion /></el-icon>
          </template>
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { Promotion } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import marked from 'marked'
import DOMPurify from 'dompurify'
import { sendMessage, createSession } from '@/api/chat'

const messagesRef = ref(null)
const inputMessage = ref('')
const loading = ref(false)
const connecting = ref(false)
const sessionId = ref('')
const retryCount = ref(0)
const maxRetries = 3

const messages = ref([
  {
    type: 'ai',
    content: '你好！我是你的AI助手，有什么我可以帮你的吗？',
    time: new Date()
  }
])

const initSession = async () => {
  if (connecting.value) return
  
  connecting.value = true
  try {
    const { id } = await createSession()
    sessionId.value = id
    retryCount.value = 0
    ElMessage.success('会话已创建')
  } catch (error) {
    if (retryCount.value < maxRetries) {
      retryCount.value++
      ElMessage.warning(`创建会话失败，正在第${retryCount.value}次重试...`)
      setTimeout(initSession, 1000 * retryCount.value)
    } else {
      ElMessage.error('创建会话失败，请刷新页面重试')
    }
  } finally {
    connecting.value = false
  }
}

onMounted(async () => {
  await initSession()
})

const scrollToBottom = async () => {
  await nextTick()
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }
}

const formatTime = (time) => {
  return dayjs(time).format('HH:mm:ss')
}

const formatMessage = (content) => {
  return DOMPurify.sanitize(marked(content))
}

const trySendMessage = async (message, retryCount = 0) => {
  try {
    const response = await sendMessage({
      sessionId: sessionId.value,
      content: message
    })
    return response
  } catch (error) {
    if (retryCount < maxRetries) {
      ElMessage.warning(`发送消息失败，正在第${retryCount + 1}次重试...`)
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)))
      return trySendMessage(message, retryCount + 1)
    }
    throw error
  }
}

const sendMessage = async () => {
  const message = inputMessage.value.trim()
  if (!message) return
  
  if (!sessionId.value) {
    ElMessage.warning('会话未创建，正在重新连接...')
    await initSession()
    if (!sessionId.value) return
  }

  const messageId = Date.now()
  // 添加用户消息
  messages.value.push({
    id: messageId,
    type: 'user',
    content: message,
    time: new Date()
  })

  inputMessage.value = ''
  loading.value = true

  try {
    const response = await trySendMessage(message)
    messages.value.push({
      id: messageId + 1,
      type: 'ai',
      content: response.content,
      time: new Date()
    })
  } catch (error) {
    ElMessage.error('发送消息失败，请重试')
    // 回滚最后发送的消息
    messages.value = messages.value.filter(msg => msg.id !== messageId)
  } finally {
    loading.value = false
  }
}

const clearChat = () => {
  messages.value = [{
    type: 'ai',
    content: '对话已清空，有什么我可以帮你的吗？',
    time: new Date()
  }]
}

watch(messages, () => {
  scrollToBottom()
}, { deep: true })

onMounted(() => {
  scrollToBottom()
})
</script>

<style lang="scss" scoped>
.chat-container {
  max-width: 800px;
  margin: 0 auto;
  height: calc(100vh - 140px);

  .chat-box {
    height: 100%;
    display: flex;
    flex-direction: column;

    .chat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        margin: 0;
      }
    }

    .messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      margin: -20px;

      .message {
        display: flex;
        gap: 12px;
        margin-bottom: 20px;

        &.user {
          flex-direction: row-reverse;

          .message-content {
            background-color: var(--el-color-primary-light-9);
            border-radius: 8px 2px 8px 8px;
          }
        }

        &.ai .message-content {
          background-color: #f4f4f5;
          border-radius: 2px 8px 8px 8px;
        }

        .message-content {
          max-width: 70%;
          padding: 12px;
          position: relative;

          p {
            margin: 0;
            white-space: pre-wrap;
          }

          .time {
            position: absolute;
            bottom: -20px;
            font-size: 12px;
            color: #909399;
          }

          :deep(code) {
            background-color: #f8f9fa;
            padding: 2px 4px;
            border-radius: 4px;
            font-family: monospace;
          }

          :deep(pre) {
            background-color: #f8f9fa;
            padding: 12px;
            border-radius: 4px;
            overflow-x: auto;

            code {
              background-color: transparent;
              padding: 0;
            }
          }
        }
      }
    }

    .input-area {
      margin-top: 20px;
      display: flex;
      gap: 12px;
      align-items: flex-start;

      .el-button {
        height: 100%;
      }
    }
  }
}
</style>

# Fure-Face (映美) — 面部美学分析与智能推荐平台

Fure-Face 是一个基于深度学习与计算机视觉的面部美学分析平台，专注于为用户提供**面部比例分析**、**对称性评估**、**医美方案推荐**及**AI 智能问答**等服务。系统采用前后端分离架构，前端为单页面应用，后端基于 Spring Cloud 微服务体系。

## 系统架构

```
┌─────────────────────────────────────────────────────┐
│                  Frontend (SPA)                       │
│   Vue 3 + Element Plus + Pinia + 纯 HTML/CSS/JS      │
└──────────────┬──────────────────────────────────────┘
               │ HTTP / SSE
┌──────────────▼──────────────────────────────────────┐
│             API Gateway (facefure-gateway)            │
│           Port 9000 · 路由 · 鉴权 · 限流 · CORS          │
└────┬──────┬──────┬──────┬──────┬──────────────────────┘
     │      │      │      │      │
┌────▼─┐ ┌─▼───┐ ┌▼────┐ ┌▼────┐ ┌▼──────────┐
│ Auth │ │User │ │Face │ │ AI  │ │  Common    │
│ 认证  │ │ 用户  │ │ 人脸  │ │ 智能  │ │  公共模块   │
│ 服务  │ │ 服务  │ │ 服务  │ │ 对话  │ │ (工具/配置) │
└──────┘ └─────┘ └─────┘ └─────┘ └───────────┘
```

## 技术栈

### 后端

| 组件 | 技术 |
|------|------|
| 基础框架 | Spring Boot 3.2.0 · Java 21 |
| 微服务 | Spring Cloud 2023.0.0 · Nacos (注册/配置) |
| 网关 | Spring Cloud Gateway 3.x |
| ORM | MyBatis-Plus 3.5.4 |
| 数据库 | MySQL · Flyway (迁移) |
| 缓存 | Redis |
| 对象存储 | MinIO |
| 消息/邮件 | JavaMail · Thymeleaf 模板 |
| AI 对接 | OpenAI SDK (兼容 DeepSeek / 豆包 API) |
| 计算机视觉 | OpenCV (JavaCV) — 人脸检测 · LBPH 识别 |
| 安全 | Spring Security · BCrypt · JWT (jjwt) |
| 文档 | Knife4j (Swagger 3) |
| 工具 | Lombok · MapStruct · Hutool · Jackson |

### 前端

| 组件 | 技术 |
|------|------|
| 框架 | Vue 3 (CDN + UMD) |
| UI 库 | Element Plus |
| 状态管理 | Pinia |
| 图标 | Font Awesome 6 |
| HTTP | Fetch API (原生) |
| AI 对接 | 豆包视觉大模型 · DeepSeek Chat API |
| 样式 | 纯 CSS · 深色/浅色双主题 |

## 项目结构

```
├── frontend/                            # 前端应用
│   ├── index.html                       # 主页面 (SPA)
│   ├── main.js                          # 核心逻辑 (Vue 3 setup)
│   ├── style.css                        # 全局样式 (含双主题)
│   ├── assets/                          # 静态资源
│   │   ├── simulation/                  # 展示图片
│   │   ├── guide-front.jpg / guide-side.jpg
│   │   └── 默认头像.jpeg
│   └── src/
│       ├── api/                         # 接口封装
│       │   ├── user.js
│       │   ├── face.js
│       │   └── chat.js
│       ├── stores/user.js               # Pinia 状态
│       ├── utils/request.js             # 请求工具
│       └── views/                       # Vue 组件
│           ├── ai-chat/index.vue
│           └── face/
│               ├── detection/index.vue
│               └── comparison/index.vue
│
├── backend/                             # 后端 (Maven 多模块)
│   ├── pom.xml                          # 父 POM
│   │
│   ├── facefure-common/                 # 公共模块
│   │   ├── config/                      # Redis · MinIO · SMS · CORS 配置
│   │   ├── constants/Constants.java     # 全局常量
│   │   ├── exception/                   # 统一异常处理
│   │   ├── model/Result.java            # 统一响应体
│   │   ├── service/                     # 邮件 / 短信服务
│   │   └── utils/                       # JWT · Redis · Security 工具
│   │
│   ├── facefure-auth/                   # 认证模块
│   │   ├── controller/AuthController    # 登录 / 注册 / 验证码 / Token 刷新
│   │   ├── service/AuthService          # 认证逻辑
│   │   └── config/SecurityConfig        # Spring Security 配置
│   │
│   ├── facefure-user/                   # 用户模块
│   │   ├── controller/UserController    # 用户 CRUD · 头像 · 密码 · 绑定管理
│   │   └── service/UserService          # 业务逻辑
│   │
│   ├── facefure-face/                   # 人脸服务模块
│   │   ├── config/OpenCVConfig          # LBPH 识别器 · Cascade 分类器
│   │   ├── service/FaceDetection        # 人脸检测
│   │   └── service/FaceComparison       # 人脸比对 (余弦相似度)
│   │
│   ├── facefure-ai/                     # AI 对话模块
│   │   ├── controller/AIChatController  # 会话管理 · 消息 (SSE 流式)
│   │   └── service/AIModelService       # OpenAI SDK 对接
│   │
│   └── facefure-gateway/               # 网关模块
│       ├── config/GatewayConfig          # CORS · IP 限流
│       └── filter/AuthenticationFilter  # JWT 鉴权全局过滤器
│
└── test/                                # 功能原型 / Demo
    ├── index.html                       # 照片上传 + 分析结果展示
    ├── login.html                       # 独立登录页
    ├── register.html                    # 独立注册页
    ├── assets/                          # 测试用图片
    ├── styles/                          # 测试用样式
    └── script/                          # 测试用脚本
```

## 核心功能

### 1. 人脸检测与分析
- 基于 OpenCV `CascadeClassifier` 检测人脸区域
- LBPH 算法提取面部特征向量
- 分析结果持久化至数据库，图片上传至 MinIO
- 支持按用户权限管理检测记录

### 2. 人脸比对
- 计算两张人脸特征向量的余弦相似度
- 相似度 > 0.8 判定为同一人
- 支持查看历史比对记录

### 3. 面部美学评估
- **面部比例分析**：三庭五眼、黄金比例偏差评估
- **对称性分析**：眼睛、鼻子、嘴部局部及整体对称度
- **肤质分析**：水分含量、弹性指数、肤色均匀度
- **个性化医美建议**：非手术类与手术类方案推荐

### 4. AI 智能助手
- 集成 DeepSeek Chat API（原生 JS 侧调用）
- 集成豆包视觉大模型（面部照片分析）
- 后端 SSE 流式对话（OpenAI SDK）
- 医疗美容领域专业问答

### 5. 医美方案展示
- 轻微/中度/重度三级方案分类
- 术前术后的 **before/after 翻转对比**
- 年龄模拟功能 (25 / 35 / 50 / 70 岁)

### 6. 用户管理
- 注册 / 登录（密码 + 验证码双模式）
- 头像裁剪上传 / 昵称 / 性别 / 密码修改
- 手机号 & 邮箱的绑定 / 换绑
- 忘记密码流程（3 步找回）
- 管理员用户搜索、状态管理

### 7. 系统特性
- 中英文双语切换
- 深色 / 浅色双主题
- JWT 令牌认证 + Token 刷新
- API 网关统一鉴权与 IP 限流
- 统一异常处理与标准响应体

## 快速启动

### 前置依赖

- JDK 21+
- Maven 3.8+
- MySQL 8.0+
- Redis 7+
- Nacos 2.x
- MinIO (对象存储)

### 启动后端

```bash
# 1. 初始化数据库
mysql -u root -p < facefure-user/src/main/resources/db/migration/V1__create_user_table.sql

# 2. 启动 Nacos、Redis、MinIO

# 3. 修改各模块 application.yml 中的数据库 / Redis / MinIO / Nacos 配置

# 4. 编译并启动
cd backend
mvn clean install -DskipTests
# 按需启动各模块：gateway → auth → user → face → ai
```

### 启动前端

```bash
# 直接打开 frontend/index.html 即可
# 或使用任意 HTTP 服务器:
cd frontend
python -m http.server 8080
```

## 接口概览

| 路径 | 模块 | 说明 |
|------|------|------|
| `POST /api/v1/auth/login` | auth | 登录 |
| `POST /api/v1/auth/register` | auth | 注册 |
| `POST /api/v1/auth/code/send` | auth | 发送验证码 |
| `POST /api/v1/auth/token/refresh` | auth | 刷新 Token |
| `GET /api/v1/user/info` | user | 获取用户信息 |
| `PUT /api/v1/user/info` | user | 更新用户信息 |
| `POST /api/v1/user/avatar` | user | 上传头像 |
| `PUT /api/v1/user/password` | user | 修改密码 |
| `POST /api/v1/user/phone/bind` | user | 绑定手机号 |
| `POST /api/v1/user/email/bind` | user | 绑定邮箱 |
| `POST /api/v1/ai/chat/message` | ai | AI 聊天 |
| `POST /api/v1/ai/chat/message/stream` | ai | AI 流式聊天 |
| `POST /api/v1/ai/chat/session` | ai | 创建会话 |
| `POST /api/v1/face/detect` | face | 人脸检测 |
| `POST /api/v1/face/compare` | face | 人脸比对 |

详情以 Swagger 文档为准（启动后访问 `http://localhost:9000/swagger-ui/`）。

## 会话历史

```
a1d4793 灵感demo
d366ce9 最终版本
89091e2 add register alert
4355e42 optimize "Age simulation" section
77f761b add HTML redirection for login and register pages
```

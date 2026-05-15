 const { createApp, ref, reactive, watch, onMounted } = Vue;
const { ElInput, ElButton, ElCheckbox, ElLink, ElSelect, ElOption, ElMessage, ElDropdown, ElDropdownMenu, ElDropdownItem, ElTooltip, ElAvatar, ElMessageBox } = ElementPlus;

// 多语言
const i18n = {
  zh: {
    welcome: "欢迎使用 Fure-Face",
    login: "登录 Fure-Face",
    registerTitle: "注册账号",
    noAccount: "没有账号？",
    hasAccount: "已有账号？",
    register: "立即注册",
    loginNow: "使用密码登录",
    username: "手机号/邮箱",
    phone: "手机号/邮箱",
    password: "密码",
    confirmPassword: "确认密码",
    code: "输入验证码",
    send: "获取验证码",
    resend: "重新发送",
    remember: "记住登录状态",
    forgot: "忘记密码？",
    loginBtn: "登录",
    registerBtn: "注册并登录",
    otherLogin: "使用验证码登录",
    lang: "语言",
    theme: "主题",
    light: "浅色模式",
    dark: "深色模式",
    mainTitle: "FURE-FACE",
    mainSub: "看见未来的你",
    mainDesc: "基于深度学习的面部特征分析系统",
    mainBtn1: "进入预测区",
    mainBtn2: "了解更多",
    navHome: "主页",
    navDetail: "详情",
    navHistory: "历史分析记录",
    navUser: "用户信息",
    navLogout: "退出登录",
    navAI: "AI智能助手",
    nickname: "昵称",
    originalPassword: "原密码",
    newPassword: "新密码",
    confirmNewPassword: "确认新密码",
    gender: "性别",
    genderMale: "男",
    genderFemale: "女",
    genderSecret: "保密"
  },
  en: {
    welcome: "Welcome to Fure-Face",
    login: "Login Fure-Face",
    registerTitle: "Register Account",
    noAccount: "No account?",
    hasAccount: "Already have an account?",
    register: "Register now",
    loginNow: "Password Login",
    username: "Username",
    phone: "Phone/Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    code: "Enter code",
    send: "Get Code",
    resend: "Resend",
    remember: "Remember me",
    forgot: "Forgot password?",
    loginBtn: "Login",
    registerBtn: "Register & Login",
    otherLogin: "Code login methods",
    lang: "Language",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    mainTitle: "FURE-FACE",
    mainSub: "Deep Learning Based Multimedia Forgery Detection Platform",
    mainDesc: "This system supports multiple forgery detection algorithms, multi-modal detection and visualization for images and videos, leveraging the latest deep learning technology to improve accuracy and efficiency, and help media content trust.",
    mainBtn1: "Detection Area",
    mainBtn2: "Learn More",
    navHome: "Home",
    navAI: "AI Assistant",
    navDetail: "Detail",
    navHistory: "Analysis History",
    navUser: "User Info",
    navLogout: "Logout",
    nickname: "Nickname",
    originalPassword: "Original Password",
    newPassword: "New Password",
    confirmNewPassword: "Confirm New Password",
    gender: "Gender",
    genderMale: "Male",
    genderFemale: "Female",
    genderSecret: "Secret"
  }
};

// 调用豆包大模型API的函数
// 检查是否为有效的人脸图片
function isValidFaceImage(imageDataUrl, isFront) {
  // 这里应该是调用人脸检测API的逻辑
  // 由于演示目的，我们假设所有图片都是有效的
  return true;
}

async function sendToDoubaoChatAPI(frontImageDataUrl, sideImageDataUrl) {
  try {
    console.log('正在准备调用豆包大模型API...');
    
    // 首先验证图片
    if (!isValidFaceImage(frontImageDataUrl, true)) {
      return {
        success: false,
        error: '正面照片无效，请上传清晰的人脸正面照片'
      };
    }
    
    if (!isValidFaceImage(sideImageDataUrl, false)) {
      return {
        success: false,
        error: '侧面照片无效，请上传清晰的人脸侧面照片'
      };
    }
    
    // 豆包API Key
    const apiKey = '37f258dd-9b84-42c1-aa7d-dbcbace89ff6';
    
    // 将base64图片数据转换为适合API的格式
    const frontImageBase64 = frontImageDataUrl.split(',')[1];  // 移除前缀
    const sideImageBase64 = sideImageDataUrl.split(',')[1];   // 移除前缀
    console.log('frontImageBase64:', frontImageBase64);
    
    // 构建请求体
    const requestBody = {
      model: 'doubao-1.5-thinking-vision-pro-250428',
      messages: [
        {
          role: 'system',
          content: [
            { type: 'text', text: '你现在是一名医美整形师，你必须使用专业的语气' }
          ]
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: '你好，由我给你的面部照片分析出面部比例、面部对称性等结果，并给出详细的改进建议,要求你直接回复问题，回答内容要求必须将三部分分开回答，三部分内容以$分开，三部分内容以$分开，三部分内容以$分开，不允许使用格式符号即*或-或# 你的回答不要出现面部比例分析：面部对称性分析：改进建议：这三个标题并且我希望将并列的内容进行换行表达' },
            { type: 'image_url', image_url: { url: `data:image/jpg;base64,${frontImageBase64}` } },
            { type: 'image_url', image_url: { url: `data:image/jpg;base64,${sideImageBase64}` } }
          ]
        }
      ],

      stream: false,
      max_tokens: 1024
    };
    
    console.log('正在发送请求到豆包API...');
    
    // 发送请求到豆包API
    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('豆包API响应:', data);
    
    // 从响应中提取分析结果
    if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
      const content = data.choices[0].message.content;
      const [contenta, contentb, contentc] = content.split('$');
      // 简单处理：假设模型返回的是结构化的文本
      // 实际使用时可能需要更复杂的文本解析或提示词工程
      return {
        success: true,
        result: {
          proportions: contenta,
          symmetry: contentb,
          details: contentc
        }
      };
    } else {
      return {
        success: false,
        error: '无法解析豆包API的响应'
      };
    }
  } catch (error) {
    console.error('调用豆包API时出错:', error);
    return {
      success: false,
      error: error.message || '未知错误'
    };
  }
}

// 用 reactive 实现全局状态
const globalState = reactive({
  lang: 'zh',
  theme: 'theme-light'
});

const langOptions = [
  { label: '中文', value: 'zh' },
  { label: 'English', value: 'en' }
];
const themeOptions = [
  { label: i18n[globalState.lang].light, value: 'theme-light' },
  { label: i18n[globalState.lang].dark, value: 'theme-dark' }
];

const app = createApp({
  setup() {
    const currentPage = ref('login');
    const isLogin = ref(true);
    const predictForm = ref({
      model: '',
      input: ''
    });
    const predictResult = ref('');

    // 登录表单
    const username = ref('');
    const password = ref('');
    const remember = ref(false);
    const loginType = ref('password'); // 'password' 或 'code'
    const loginCode = ref('');
    const loginPhone = ref('');
    const loginEmail = ref('');
    const codeType = ref('phone'); // 'phone' 或 'email'
    
    // 忘记密码表单
    const isForgotPassword = ref(false);
    const forgotPasswordStep = ref(1); // 1: 选择方式, 2: 输入验证码, 3: 重置密码
    const forgotPasswordMethod = ref('phone'); // 'phone' 或 'email'
    const forgotPasswordPhone = ref('');
    const forgotPasswordEmail = ref('');
    const forgotPasswordCode = ref('');
    const newPassword = ref('');
    const confirmNewPassword = ref('');

    // 注册表单
    const phone = ref('');
    const nickname = ref('');
    const regCode = ref('');
    const confirmPassword = ref('');
    const codeBtnText = ref(i18n[globalState.lang].send);
    const codeBtnDisabled = ref(false);
    let timer = null;
    const countdown = ref(60);

    const t = (key) => i18n[globalState.lang][key];

    function startCountdown() {
      codeBtnDisabled.value = true;
      countdown.value = 60;
      codeBtnText.value = `${t('resend')}（${countdown.value}）`;
      timer = setInterval(() => {
        countdown.value--;
        codeBtnText.value = `${t('resend')}（${countdown.value}）`;
        if (countdown.value <= 0) {
          clearInterval(timer);
          codeBtnText.value = t('resend');
          codeBtnDisabled.value = false;
        }
      }, 1000);
    }

    // 切换主题
    watch(() => globalState.theme, (val) => {
      document.body.className = val;
    }, { immediate: true });

    // 密码验证函数
    function validatePassword(password) {
      if (password.length < 8) {
        return {
          valid: false,
          message: globalState.lang === 'zh' ? '密码长度至少为8位' : 'Password must be at least 8 characters'
        };
      }
      
      // 检查复杂度：符号、大写字母、小写字母、数字至少包含两类
      let complexityCount = 0;
      if (/[A-Z]/.test(password)) complexityCount++; // 大写字母
      if (/[a-z]/.test(password)) complexityCount++; // 小写字母
      if (/[0-9]/.test(password)) complexityCount++; // 数字
      if (/[^A-Za-z0-9]/.test(password)) complexityCount++; // 特殊字符
      
      if (complexityCount < 2) {
        return {
          valid: false,
          message: globalState.lang === 'zh' ? '密码需包含大写字母、小写字母、数字和符号中的至少两类' : 'Password must contain at least two types of the following: uppercase letters, lowercase letters, numbers, and symbols'
        };
      }
      
      return {
        valid: true,
        message: ''
      };
    }

    const handleLogin = () => {
      if (loginType.value === 'password') {
        if (!username.value || !password.value) {
          ElMessage.warning(globalState.lang === 'zh' ? '请填写完整信息' : 'Please fill all fields');
          return;
        }
        
        // 判断是手机号还是邮箱
        const isEmail = username.value.includes('@');
        if (isEmail) {
          userInfo.email = username.value;
        } else {
          userInfo.phone = username.value;
        }
        userInfo.password = password.value; // 保存密码到用户信息
      } else {
        if ((codeType.value === 'phone' && !loginPhone.value) || 
            (codeType.value === 'email' && !loginEmail.value) || 
            !loginCode.value) {
          ElMessage.warning(globalState.lang === 'zh' ? '请填写完整信息' : 'Please fill all fields');
          return;
        }
        
        if (codeType.value === 'phone') {
          userInfo.phone = loginPhone.value; // 保存手机号到用户信息
        } else {
          userInfo.email = loginEmail.value; // 保存邮箱到用户信息
        }
      }
      
      ElMessage.success(globalState.lang === 'zh' ? '登录成功（演示）' : 'Login success (demo)');
      currentPage.value = 'main';
      isCodeLogin.value = false;
    };

    const handleRegister = () => {
      if (!nickname.value || !phone.value || !regCode.value || !password.value || !confirmPassword.value) {
        ElMessage.warning(globalState.lang === 'zh' ? '请填写完整信息' : 'Please fill all fields');
        return;
      }
      
      // 验证密码
      const passwordValidation = validatePassword(password.value);
      if (!passwordValidation.valid) {
        ElMessage.warning(passwordValidation.message);
        return;
      }
      
      if (password.value !== confirmPassword.value) {
        ElMessage.warning(globalState.lang === 'zh' ? '两次输入的密码不一致' : 'Passwords do not match');
        return;
      }
      
      // 保存注册信息到用户资料
      userInfo.nickname = nickname.value;
      userInfo.phone = phone.value;
      userInfo.password = password.value;
      
      ElMessage.success(globalState.lang === 'zh' ? '注册成功' : 'Register success');
      isLogin.value = true;
    };

    // 修改各个获取验证码的函数，简化为直接开始倒计时
    function handleGetCode() { // 用于注册流程
      // 直接调用倒计时并模拟发送短信
      ElMessage.success(globalState.lang === 'zh' ? '验证码已发送' : 'Verification code sent');
      startCountdown();
    }

    function handleGetCodeForCodeLogin() { // 用于验证码登录流程
      // 直接调用倒计时并模拟发送短信
      ElMessage.success(globalState.lang === 'zh' ? '验证码已发送' : 'Verification code sent');
      startCountdown();
    }
    
    function handleGetCodeForForgotPassword() { // 用于忘记密码
      // 直接调用倒计时并模拟发送短信
      ElMessage.success(globalState.lang === 'zh' ? '验证码已发送' : 'Verification code sent');
        startCountdown();
    }
    
    function getVerifyCode(bindType) { // 用于用户信息修改
      // 根据绑定类型显示不同的消息
      if (bindType === 'phone') {
        ElMessage.success(globalState.lang === 'zh' ? '手机验证码已发送' : 'Phone verification code sent');
      } else {
        ElMessage.success(globalState.lang === 'zh' ? '邮箱验证码已发送' : 'Email verification code sent');
      }
      startCountdown();
    }
    
    // 忘记密码处理
    function handleForgotPassword() {
      isForgotPassword.value = true;
      codeBtnDisabled.value = false; // 重置按钮状态以便用户可以点击获取验证码
      countdown.value = 0;
      codeBtnText.value = t('send');
    }
    
    // 下一步处理 (忘记密码)
    function handleNextStep() {
      if (forgotPasswordStep.value === 1) {
        if ((forgotPasswordMethod.value === 'phone' && !forgotPasswordPhone.value) || 
            (forgotPasswordMethod.value === 'email' && !forgotPasswordEmail.value)) {
          ElMessage.warning(globalState.lang === 'zh' ? '请填写完整信息' : 'Please fill all fields');
          return;
        }
            forgotPasswordStep.value = 2;
        codeBtnDisabled.value = false; // 允许用户在第二步点击获取验证码
        countdown.value = 0; 
        codeBtnText.value = t('send');
      } else if (forgotPasswordStep.value === 2) {
        if (!forgotPasswordCode.value) {
          ElMessage.warning(globalState.lang === 'zh' ? '请输入验证码' : 'Please enter verification code');
          return;
        }
        forgotPasswordStep.value = 3;
      } else if (forgotPasswordStep.value === 3) {
        if (!newPassword.value || !confirmNewPassword.value) {
          ElMessage.warning(globalState.lang === 'zh' ? '请填写完整信息' : 'Please fill all fields');
          return;
        }
        
        // 验证新密码
        const passwordValidation = validatePassword(newPassword.value);
        if (!passwordValidation.valid) {
          ElMessage.warning(passwordValidation.message);
          return;
        }
        
        if (newPassword.value !== confirmNewPassword.value) {
          ElMessage.warning(globalState.lang === 'zh' ? '两次输入的密码不一致' : 'Passwords do not match');
          return;
        }
        ElMessage.success(globalState.lang === 'zh' ? '密码重置成功，请登录' : 'Password reset successfully, please login');
        // 重置状态
        resetForgotPasswordForm();
      }
    }
    
    // 重置忘记密码表单
    function resetForgotPasswordForm() {
      isForgotPassword.value = false;
      forgotPasswordStep.value = 1;
      forgotPasswordMethod.value = 'phone';
      forgotPasswordPhone.value = '';
      forgotPasswordEmail.value = '';
      forgotPasswordCode.value = '';
      newPassword.value = '';
      confirmNewPassword.value = '';
    }

    // 导航栏菜单
    const navItems = [
      { icon: 'fas fa-home', label: () => t('navHome'), key: 'home', tooltip: t('navHome') },
      { icon: 'fas fa-brain', label: () => t('navAI'), key: 'ai', tooltip: t('navAI'), onClick: () => { navActive.value = 'ai'; } },
      { icon: 'fas fa-history', label: () => t('navHistory'), key: 'history', tooltip: t('navHistory') },
      { icon: 'fas fa-user', label: () => t('navUser'), key: 'user', tooltip: t('navUser') }
    ];
    const navActive = ref('home');

    // 退出登录
    function handleLogout() {
      ElMessageBox.confirm(
        globalState.lang === 'zh' ? '确定要退出登录吗？' : 'Are you sure you want to logout?',
        globalState.lang === 'zh' ? '提示' : 'Tips',
        {
          confirmButtonText: globalState.lang === 'zh' ? '确定' : 'Confirm',
          cancelButtonText: globalState.lang === 'zh' ? '取消' : 'Cancel',
          type: 'warning',
          customClass: 'custom-message-box'
        }
      ).then(() => {
      currentPage.value = 'login';
      isLogin.value = true;
      username.value = '';
      password.value = '';
      phone.value = '';
      regCode.value = '';
        // 清空用户信息
        userInfo.nickname = '';
        userInfo.password = '';
        userInfo.phone = '';
        userInfo.email = '';
        // 重置头像为默认
        userInfo.avatar = 'assets/默认头像.jpeg';
        ElMessage.success(globalState.lang === 'zh' ? '已退出登录' : 'Logged out successfully');
      }).catch(() => {
        // 用户取消退出
      });
    }

    // 确保初始化时立即应用深色主题
    onMounted(() => {
      document.body.className = globalState.theme;
      
      // 添加 DOM 准备好后的一些初始化
      const initPage = () => {
        // 添加背景装饰元素
        if (!document.querySelector('.bg-decoration')) {
          const bgDecoration = document.createElement('div');
          bgDecoration.className = 'bg-decoration';
          document.body.appendChild(bgDecoration);
        }
        
        if (!document.querySelector('.bg-shapes')) {
          const bgShapes = document.createElement('div');
          bgShapes.className = 'bg-shapes';
          document.body.appendChild(bgShapes);
        }
      };
      
      // 初始化页面
      initPage();
      
      watch(() => navActive.value, (val) => {
        console.log('[DEBUG] navActive changed to:', val); // Log: Navigation change
        if (val === 'predict') {
          initializePredictArea();
        }
        // Scroll chat to bottom when AI tab is active and messages change
        if (val === 'ai' && chatWindow.value) {
            Vue.nextTick(() => {
                chatWindow.value.scrollTop = chatWindow.value.scrollHeight;
            });
        }
      }, { immediate: true });
    });

    // AI助手对话
    const messages = ref([
      { id: 1, role: 'assistant', content: '您好，我是AI智能助手，有什么可以帮您？' }
    ]);
    const inputMsg = ref('');
    const chatWindow = ref(null);
    const isThinking = ref(false);

    // 历史分析记录
    const analysisHistory = ref([]);
    let frontPhotoDataUrl = null;
    let sidePhotoDataUrl = null;

    async function sendMsg() {
      if (!inputMsg.value.trim() || isThinking.value) return;
      const userMsg = { id: Date.now(), role: 'user', content: inputMsg.value };
      messages.value.push(userMsg);
      const loadingMsg = { id: Date.now() + 1, role: 'assistant', content: '思考中...' };
      messages.value.push(loadingMsg);
      isThinking.value = true;
      inputMsg.value = '';
      const apiKey = 'sk-678f102061ce45c6918be4b1692211ce'; // 请替换为您的有效API密钥

      // 构建发送给API的消息列表，包含系统提示和用户对话
      const messagesForAPI = [
        {
          role: 'system',
          content: '你是一个专业的医疗美容AI助手。回答尽量简洁，你的任务是专门解答用户关于医疗美容、皮肤护理、整形项目、术后恢复、美容产品成分等相关问题。请遵循以下准则：\n1. 专业性：提供准确、基于科学和行业知识的回答。如果遇到不确定的问题，请坦诚告知用户并建议咨询专业医生。\n2. 安全性：始终将用户的健康和安全放在首位。对于任何可能涉及风险的操作或产品，务必提醒用户注意风险并寻求专业医疗建议。\n3. 客观性：避免推荐特定品牌或机构，除非用户明确要求或作为行业普遍认可的例子。保持中立和客观。\n4. 详细性：尽量提供详细的解释和建议，帮助用户全面了解相关信息。\n5. 通俗易懂：使用清晰、易懂的语言，避免过多的专业术语，确保用户能够理解。\n6. 友好耐心：以友好、耐心的态度与用户交流。\n7. 专注领域：只回答与医疗美容及相关领域的问题。如果用户提出无关问题，请礼貌地引导他们回到你的专业领域，或说明你无法回答该领域外的问题。\n8. 法律与道德：不提供任何违反法律法规或医学伦理的建议。'
        },
        // 从第二条消息开始，过滤掉之前的加载提示和系统提示，只保留真实对话
        ...messages.value.filter(m => m.id !== loadingMsg.id && m.role !== 'system').map(m => ({ role: m.role, content: m.content }))
      ];

      try {
        const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: messagesForAPI // 使用包含系统提示的新消息列表
          })
        });
        const data = await res.json();
        messages.value.pop();
        if (data.choices && data.choices[0] && data.choices[0].message) {
          messages.value.push({ id: Date.now() + 2, role: 'assistant', content: data.choices[0].message.content });
        } else {
          messages.value.push({ id: Date.now() + 2, role: 'assistant', content: 'AI助手暂时无法回答，请稍后再试。' });
        }
      } catch (e) {
        messages.value.pop();
        messages.value.push({ id: Date.now() + 2, role: 'assistant', content: '网络错误，请重试。' });
      }
      isThinking.value = false;
      setTimeout(() => {
        if (chatWindow.value) chatWindow.value.scrollTop = chatWindow.value.scrollHeight;
      }, 100);
    }

    // 用户信息数据
    const userInfo = reactive({
      avatar: 'assets/默认头像.jpeg',
      nickname: 'admin',
      password: '',
      phone: '',
      email: '',
      gender: '性别' // 添加性别字段，默认为保密
    });
    // 头像上传与裁剪
    const showAvatarCropper = ref(false);
    const avatarFile = ref(null);
    const avatarPreview = ref('');
    function openAvatarCropper() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          avatarPreview.value = ev.target.result;
          showAvatarCropper.value = true;
          setTimeout(() => cropToSquare(ev.target.result), 100);
        };
        reader.readAsDataURL(file);
      };
      input.click();
    }
    function cropToSquare(imgSrc) {
      const img = new window.Image();
      img.onload = function() {
        const size = Math.min(img.width, img.height);
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, (img.width-size)/2, (img.height-size)/2, size, size, 0, 0, size, size);
        avatarPreview.value = canvas.toDataURL('image/png');
      };
      img.src = imgSrc;
    }
    function saveAvatar() {
      userInfo.avatar = avatarPreview.value;
      showAvatarCropper.value = false;
    }
    function cancelAvatar() {
      showAvatarCropper.value = false;
    }

    const handlePredictClick = () => {
      navActive.value = 'predict';
    }

    const handlePredict = () => {
      // 这里添加预测逻辑
      predictResult.value = '预测结果将在这里显示...';
    };

    const isCodeLogin = ref(false);

    // 添加用于处理信息修改和换绑的状态
    const isEditingPassword = ref(false);
    const isBindingPhone = ref(false);
    const isBindingEmail = ref(false);
    const originalPassword = ref('');
    const newPhone = ref('');
    const newEmail = ref('');
    const verifyCode = ref('');
    
    // 保存昵称的方法
    function saveNickname() {
      if (!userInfo.nickname) {
        ElMessage.warning(globalState.lang === 'zh' ? '昵称不能为空' : 'Nickname cannot be empty');
        return;
      }
      ElMessage.success(globalState.lang === 'zh' ? '昵称修改成功' : 'Nickname updated successfully');
    }
    
    // 密码修改相关方法
    function startEditPassword() {
      isEditingPassword.value = true;
      originalPassword.value = '';
      newPassword.value = '';
      confirmNewPassword.value = '';
            }

    function savePassword() {
      if (!originalPassword.value || !newPassword.value || !confirmNewPassword.value) {
        ElMessage.warning(globalState.lang === 'zh' ? '请填写完整密码信息' : 'Please fill all password fields');
                  return;
                }
      if (originalPassword.value !== userInfo.password) {
        ElMessage.warning(globalState.lang === 'zh' ? '原密码不正确' : 'Original password is incorrect');
                  return;
                }
      
      // 验证新密码
      const passwordValidation = validatePassword(newPassword.value);
      if (!passwordValidation.valid) {
        ElMessage.warning(passwordValidation.message);
        return;
      }
      
      if (newPassword.value !== confirmNewPassword.value) {
        ElMessage.warning(globalState.lang === 'zh' ? '两次输入的密码不一致' : 'Passwords do not match');
        return;
      }
      userInfo.password = newPassword.value;
      isEditingPassword.value = false;
      ElMessage.success(globalState.lang === 'zh' ? '密码修改成功' : 'Password updated successfully');
    }
    
    function cancelEditPassword() {
      isEditingPassword.value = false;
    }
    
    // 手机号换绑相关方法
    function startBindPhone() {
      isBindingPhone.value = true;
      newPhone.value = '';
      verifyCode.value = '';
    }
    
    function savePhone() {
      if (!newPhone.value || !verifyCode.value) {
        ElMessage.warning(globalState.lang === 'zh' ? '请填写完整手机信息和验证码' : 'Please fill phone and verification code');
        return;
      }
      userInfo.phone = newPhone.value;
      isBindingPhone.value = false;
      ElMessage.success(globalState.lang === 'zh' ? '手机号换绑成功' : 'Phone number updated successfully');
    }
    
    function cancelBindPhone() {
      isBindingPhone.value = false;
    }
    
    // 邮箱换绑相关方法
    function startBindEmail() {
      isBindingEmail.value = true;
      newEmail.value = '';
      verifyCode.value = '';
    }
    
    function saveEmail() {
      if (!newEmail.value || !verifyCode.value) {
        ElMessage.warning(globalState.lang === 'zh' ? '请填写完整邮箱信息和验证码' : 'Please fill email and verification code');
        return;
      }
      userInfo.email = newEmail.value;
      isBindingEmail.value = false;
      ElMessage.success(globalState.lang === 'zh' ? '邮箱换绑成功' : 'Email updated successfully');
    }
    
    function cancelBindEmail() {
      isBindingEmail.value = false;
    }
    
    // 封装预测区初始化逻辑
    function initializePredictArea() {
      console.log('[DEBUG] initializePredictArea called');
      
      // 使用setTimeout确保DOM已完全渲染
      setTimeout(() => {
        console.log('[DEBUG] 开始绑定预测区事件');
        
        // 获取预测区容器元素（改为使用.upload-section类选择器）
        const uploadSection = document.querySelector('.upload-section');
        if (!uploadSection) {
          // 尝试其他可能的选择器
          console.log('[DEBUG] 尝试查找其他可能的预测区容器');
          const alternativeUploadSection = document.querySelector('.upload-area') || 
                                          document.querySelector('[id*="upload"]') ||
                                          document.querySelector('.predict-container');
          
          if (alternativeUploadSection) {
            console.log('[DEBUG] 找到替代预测区容器:', alternativeUploadSection);
            // 继续使用找到的替代元素
            initializeWithContainer(alternativeUploadSection);
          } else {
            console.error('找不到预测区容器元素，无法初始化预测区');
            // 打印出当前页面的主要元素，帮助调试
            console.log('[DEBUG] 当前页面结构:', document.body.innerHTML.substring(0, 500) + '...');
          }
          return;
        }
        
        // 如果找到了uploadSection，使用它初始化
        initializeWithContainer(uploadSection);
        
        // 使用找到的容器进行初始化的函数
        function initializeWithContainer(container) {
          console.log('[DEBUG] 使用容器初始化预测区:', container);
          
          // 查找前面和侧面上传框
          const frontUpload = document.getElementById('frontUpload') || container.querySelector('.upload-box:first-child') || container.querySelector('[id*="front"]');
          const sideUpload = document.getElementById('sideUpload') || container.querySelector('.upload-box:last-child') || container.querySelector('[id*="side"]');
          
          // 查找文件输入元素
          const frontInput = document.getElementById('frontInput') || frontUpload?.querySelector('input[type="file"]');
          const sideInput = document.getElementById('sideInput') || sideUpload?.querySelector('input[type="file"]');
          
          // 查找分析按钮和进度相关元素
          const analyzeButton = document.getElementById('analyzeButton') || container.querySelector('.analyze-button') || document.querySelector('.analyze-button');
          const progressContainer = document.getElementById('progressContainer') || container.querySelector('.progress-container') || document.querySelector('.progress-container');
          const progressFill = progressContainer?.querySelector('.progress-fill') || document.getElementById('progressFill');
          const analysisSection = document.getElementById('analysisSection') || document.querySelector('.analysis-section');
          
          console.log('[DEBUG] 找到的关键元素:', { 
            frontUpload, sideUpload, frontInput, sideInput, 
            analyzeButton, progressContainer, progressFill, analysisSection 
          });
          
          // 验证关键元素
          if (!frontUpload || !sideUpload) {
            console.error('找不到上传框元素，无法初始化预测区');
            return;
          }
          
          if (!frontInput || !sideInput) {
            console.error('找不到文件输入元素，无法初始化预测区');
            // 如果没有找到输入元素，创建它们
            if (frontUpload && !frontInput) {
              frontInput = document.createElement('input');
              frontInput.type = 'file';
              frontInput.id = 'frontInput';
              frontInput.accept = 'image/*';
              frontInput.style.display = 'none';
              frontUpload.appendChild(frontInput);
              console.log('[DEBUG] 创建了frontInput元素');
            }
            
            if (sideUpload && !sideInput) {
              sideInput = document.createElement('input');
              sideInput.type = 'file';
              sideInput.id = 'sideInput';
              sideInput.accept = 'image/*';
              sideInput.style.display = 'none';
              sideUpload.appendChild(sideInput);
              console.log('[DEBUG] 创建了sideInput元素');
            }
          }
          
          if (!analyzeButton || !progressContainer || !progressFill || !analysisSection) {
            console.warn('缺少一些非关键元素，部分功能可能不可用');
          }
          
          const progressTextElement = progressContainer?.querySelector('.progress-text');
          
          // 保存照片文件和数据URL的变量
          let frontPhotoFile = null;
          let sidePhotoFile = null;
          
          // 更新分析按钮状态
          function updateButtonState() {
            if (!analyzeButton) return;
            
            analyzeButton.disabled = !(frontPhotoFile && sidePhotoFile);
            
            if (analyzeButton.textContent !== '重新分析' && 
                analyzeButton.textContent !== '分析中...') {
              analyzeButton.textContent = '开始分析';
            }
          }
          
          // 初始化按钮状态
          updateButtonState();
          
          // 处理照片上传的函数
          function handlePhotoUpload(file, uploadBox, isFront) {
            console.log(`处理照片上传: ${isFront ? '正面' : '侧面'}`, file);
            
            if (!file) {
              console.error(`没有提供文件`);
              return;
            }
            
            if (!file.type.startsWith('image/')) {
              ElMessage.error('请选择图片文件');
              return;
            }
            
            if (file.size > 5 * 1024 * 1024) {
              ElMessage.error('图片大小不能超过5MB');
              return;
            }
            
            if (!uploadBox) {
              console.error(`找不到上传框`);
              return;
            }
            
            // 查找或创建预览元素
            let previewContainer = uploadBox.querySelector('.preview-container');
            let preview;
            
            if (!previewContainer) {
              console.log('[DEBUG] 创建预览容器');
              previewContainer = document.createElement('div');
              previewContainer.className = 'preview-container';
              previewContainer.style.display = 'none';
              
              preview = document.createElement('img');
              preview.id = isFront ? 'frontPreview' : 'sidePreview';
              previewContainer.appendChild(preview);
              
              const reuploadBtn = document.createElement('button');
              reuploadBtn.className = 'reupload-btn';
              reuploadBtn.textContent = '重新上传';
              reuploadBtn.onclick = (e) => {
                e.stopPropagation();
                clearUpload(uploadBox, isFront);
              };
              previewContainer.appendChild(reuploadBtn);
              
              uploadBox.appendChild(previewContainer);
            } else {
              preview = previewContainer.querySelector('img');
              if (!preview) {
                preview = document.createElement('img');
                preview.id = isFront ? 'frontPreview' : 'sidePreview';
                previewContainer.appendChild(preview);
              }
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
              preview.src = e.target.result;
              
              previewContainer.style.display = 'flex';
              const placeholder = uploadBox.querySelector('.upload-placeholder');
              if (placeholder) placeholder.style.display = 'none';
              
              // 保存文件和数据URL
              if (isFront) {
                frontPhotoFile = file;
                frontPhotoDataUrl = e.target.result;
              } else {
                sidePhotoFile = file;
                sidePhotoDataUrl = e.target.result;
              }
              
              // 更新按钮状态
              updateButtonState();
            };
            
            reader.readAsDataURL(file);
          }
          
          // 清除上传的函数
          function clearUpload(uploadBox, isFront) {
            console.log(`清除上传: ${isFront ? '正面' : '侧面'}`);
            
            if (!uploadBox) {
              console.error(`找不到上传框`);
              return;
            }
            
            const previewContainer = uploadBox.querySelector('.preview-container');
            if (!previewContainer) {
              console.error(`找不到预览容器`);
              return;
            }
            
            const preview = previewContainer.querySelector('img');
            if (preview) {
              preview.src = '';
            }
            
            previewContainer.style.display = 'none';
            const placeholder = uploadBox.querySelector('.upload-placeholder');
            if (placeholder) placeholder.style.display = '';
            
            // 清除文件和数据URL
            if (isFront) {
              frontPhotoFile = null;
              frontPhotoDataUrl = null;
            } else {
              sidePhotoFile = null;
              sidePhotoDataUrl = null;
            }
            
            // 更新按钮状态
            updateButtonState();
          }
          
          // 绑定点击上传事件
          if (frontUpload) {
            frontUpload.addEventListener('click', function() {
              console.log('正面上传框被点击');
              if (frontInput) {
                frontInput.click();
              } else {
                console.error('找不到frontInput元素');
              }
            });
          }
          
          if (sideUpload) {
            sideUpload.addEventListener('click', function() {
              console.log('侧面上传框被点击');
              if (sideInput) {
                sideInput.click();
              } else {
                console.error('找不到sideInput元素');
              }
            });
          }
          
          // 绑定文件选择事件
          if (frontInput) {
            frontInput.addEventListener('change', function(e) {
              console.log('frontInput变化事件');
              if (this.files && this.files.length > 0) {
                handlePhotoUpload(this.files[0], frontUpload, true);
              }
            });
          }
          
          if (sideInput) {
            sideInput.addEventListener('change', function(e) {
              console.log('sideInput变化事件');
              if (this.files && this.files.length > 0) {
                handlePhotoUpload(this.files[0], sideUpload, false);
              }
            });
          }
          
          // 绑定拖放事件
          function setupDragDrop(uploadBox, isFront) {
            if (!uploadBox) {
              console.error(`找不到上传框，无法设置拖放`);
              return;
            }
            
            uploadBox.addEventListener('dragover', function(e) {
              e.preventDefault();
              this.classList.add('dragover');
            });
            
            uploadBox.addEventListener('dragleave', function() {
              this.classList.remove('dragover');
            });
            
            uploadBox.addEventListener('drop', function(e) {
              e.preventDefault();
              console.log(`拖放事件在 ${isFront ? '正面' : '侧面'} 上传框`);
              this.classList.remove('dragover');
              
              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                handlePhotoUpload(e.dataTransfer.files[0], this, isFront);
              }
            });
          }
          
          if (frontUpload) setupDragDrop(frontUpload, true);
          if (sideUpload) setupDragDrop(sideUpload, false);
          
          // 绑定分析按钮事件
          if (analyzeButton) {
            analyzeButton.addEventListener('click', async function() {
              console.log('分析按钮被点击');
              
              const reanalyzeText = '重新分析';
              const analyzingText = '分析中...';
              const analysisCompleteText = '分析完成，前往历史记录查看';
              
              if (this.textContent === reanalyzeText && analysisSection) {
                analysisSection.hidden = true;
                if (progressFill) progressFill.style.width = '0%';
              }
              
              if (!frontPhotoFile || !sidePhotoFile) {
                ElMessage.warning('请先上传正面和侧面照片');
                return;
              }
              
              this.disabled = true;
              this.textContent = analyzingText;
              
              if (progressContainer) progressContainer.hidden = false;
              if (progressFill) progressFill.style.width = '0%';
              if (progressTextElement) progressTextElement.textContent = '正在分析中...';
              
              let analysisResult = null;
              let apiCompleted = false;
              
              // 定义完成进度的函数
              const completeProgress = () => {
                // 使用requestAnimationFrame实现平滑的最终进度动画
                let currentProgress = 90;
                const finalProgress = 100;
                const step = () => {
                  currentProgress += 1;
                  if (progressFill) {
                    progressFill.style.width = `${currentProgress}%`;
                  }
                  
                  if (currentProgress < finalProgress) {
                    requestAnimationFrame(step);
                  } else {
                    // 最终进度达到100%后的操作
                    if (analysisSection) {
                      analysisSection.hidden = false;
                      analysisSection.scrollIntoView({ behavior: 'smooth' });
                    }
                    
                    if (progressTextElement) {
                      progressTextElement.textContent = analysisCompleteText;
                    }
                    
                    this.textContent = reanalyzeText;
                    this.disabled = false;
                    
                    // 保存到历史记录
                    if (frontPhotoDataUrl && sidePhotoDataUrl) {
                      // 根据历史记录数量设置不同的预测照片
                      let predictionImagePath;
                      if (analysisHistory.value.length === 0) {
                        // 第一次上传
                        predictionImagePath = 'assets/simulation/yuce2.jpg';
                      } else {
                        // 第二次上传
                        predictionImagePath = 'assets/simulation/yuce1.jpg';
                      }
                      
                      analysisHistory.value.unshift({
                        id: Date.now(),
                        date: new Date().toLocaleString(),
                        frontImage: frontPhotoDataUrl,
                        sideImage: sidePhotoDataUrl,
                        predictionImage: predictionImagePath, // 添加预测照片路径
                        summary: {
                          proportions: analysisResult.proportions,
                          symmetry: analysisResult.symmetry
                        },
                        details: analysisResult.details
                      });
                    } else {
                      console.error('无法获取照片数据URL，无法保存到历史记录');
                    }
                  }
                };
                
                // 启动最终进度动画
                requestAnimationFrame(step);
              };
              
              // 立即开始API调用
              (async () => {
                try {
                  // 发送请求到豆包大模型API
                  const doubaoPrediction = await sendToDoubaoChatAPI(frontPhotoDataUrl, sidePhotoDataUrl);
                  
                  if (doubaoPrediction && doubaoPrediction.success) {
                    analysisResult = doubaoPrediction.result;
                    console.log('豆包大模型分析结果:', analysisResult);
                  } else {
                    console.error('豆包大模型分析失败:', doubaoPrediction?.error || '未知错误');
                    // 如果失败，使用默认分析结果
                    analysisResult = {
                      proportions: '面部比例良好，接近黄金比例。',
                      symmetry: '面部对称性较高，五官分布均衡。',
                      details: '详细分析：根据您的面部数据，您的三庭五眼比例协调，脸颊饱满，下颌线清晰。建议保持良好的作息和饮食习惯。'
                    };
                  }
                } catch (error) {
                  console.error('调用豆包大模型API时出错:', error);
                  // 如果出错，使用默认分析结果
                  analysisResult = {
                    proportions: '面部比例良好，接近黄金比例。',
                    symmetry: '面部对称性较高，五官分布均衡。',
                    details: '详细分析：根据您的面部数据，您的三庭五眼比例协调，脸颊饱满，下颌线清晰。建议保持良好的作息和饮食习惯。'
                  };
                } finally {
                  // 标记API已完成
                  apiCompleted = true;
                  
                  // 如果进度条已经到达90%，则完成剩余进度
                  if (progress >= 90) {
                    completeProgress();
                  }
                }
              })();
              
              // 同时启动进度条动画
              let progress = 0;
              const progressInterval = setInterval(() => {
                progress += 1; // 每次增加1%，使动画更平滑
                
                if (progressFill) {
                  progressFill.style.width = `${progress}%`;
                }
                
                // 当进度达到90%时
                if (progress >= 90) {
                  clearInterval(progressInterval);
                  
                  // 如果API已经完成，则完成剩余进度
                  if (apiCompleted) {
                    completeProgress();
                  }
                  // 否则等待API完成后自动调用completeProgress
                }
              }, 250); // 每50ms更新一次，使动画更平滑
              
              // 不要在这里调用completeProgress，而是在API调用完成后调用
            });
          }
          
          console.log('预测区初始化完成');
        }
      }, 500); // 延长延迟时间，确保DOM已完全渲染
    }

    return {
      globalState, isLogin, currentPage,
      username, password, remember,
      phone, nickname, regCode, confirmPassword,
      t, handleLogin, handleRegister,
      langOptions, themeOptions,
      codeBtnText, codeBtnDisabled, handleGetCode,
      navItems, navActive, handleLogout,
      messages, inputMsg, sendMsg, chatWindow,
      userInfo,
      showAvatarCropper, avatarPreview, openAvatarCropper, saveAvatar, cancelAvatar,
      isThinking,
      handlePredictClick,
      predictForm,
      predictResult,
      handlePredict,
      isCodeLogin,
      loginType, loginCode, loginPhone, loginEmail, codeType,
      isForgotPassword, forgotPasswordStep, forgotPasswordMethod, 
      forgotPasswordPhone, forgotPasswordEmail, forgotPasswordCode,
      newPassword, confirmNewPassword,
      handleForgotPassword, handleNextStep, resetForgotPasswordForm,
      // 添加新的状态和方法
      isEditingPassword, isBindingPhone, isBindingEmail,
      originalPassword, newPhone, newEmail, verifyCode,
      startEditPassword, savePassword, cancelEditPassword,
      startBindPhone, savePhone, cancelBindPhone,
      startBindEmail, saveEmail, cancelBindEmail,
      getVerifyCode, // 已修改
      handleGetCodeForCodeLogin, // 新增
      handleGetCodeForForgotPassword, // 新增
      saveNickname,
      analysisHistory
    };
  },
  template: `
    <div>
      <div class="bg-decoration"></div>
      <div class="bg-shapes"></div>
      <template v-if="currentPage === 'login' && !isCodeLogin && !isForgotPassword">
        <div class="header-bar">
          <div style="font-weight:bold;font-size:20px;">{{ t('welcome') }}</div>
          <div style="display:flex;gap:16px;align-items:center;">
            <!-- 语言切换 -->
            <el-dropdown @command="val => globalState.lang = val">
              <span class="el-dropdown-link" :class="{'lang-bright': globalState.theme === 'theme-dark'}" style="cursor:pointer;display:flex;align-items:center;">
                <span style="margin:0 4px;">{{ t('lang') }}</span> <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-for="item in langOptions" :key="item.value" :command="item.value">
                    {{ item.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <!-- 主题切换 -->
            <el-dropdown @command="val => globalState.theme = val">
              <span class="el-dropdown-link" :class="{'theme-bright': globalState.theme === 'theme-dark'}" style="cursor:pointer;display:flex;align-items:center;">
                <span style="margin:0 4px;">{{ t('theme') }}</span> <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-for="item in themeOptions" :key="item.value" :command="item.value">
                    {{ item.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
        <div class="app-container">
          <div class="login-panel">
            <template v-if="isLogin">
              <h2 style="margin-bottom:8px;">{{ t('login') }}</h2>
              <div style="margin-bottom:16px;">
                <span>{{ t('noAccount') }}</span>
                <el-link type="primary" style="margin-left:4px;" @click="isLogin=false">{{ t('register') }}</el-link>
              </div>
              <el-input v-model="username" :placeholder="t('username')" class="input-bordered" style="margin-bottom:16px;" />
              <el-input v-model="password" :placeholder="t('password')" show-password class="input-bordered" style="margin-bottom:16px;" />
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                <el-checkbox v-model="remember">{{ t('remember') }}</el-checkbox>
                <el-link type="info" @click="handleForgotPassword">{{ t('forgot') }}</el-link>
              </div>
              <el-button type="primary" style="width:100%;margin:0 0 16px 0;padding:10px 0;height:32px;box-sizing:border-box;background:linear-gradient(90deg, #ff758c 0%, #ff7eb3 100%);border-radius:8px;font-size:18px;font-weight:500;border:none;" @click="handleLogin">
                {{ t('loginBtn') }}
              </el-button>
              <el-button type="primary" style="width:100%;margin:0 0 16px 0;padding:10px 0;height:32px;box-sizing:border-box;background:linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);border-radius:8px;font-size:18px;font-weight:500;border:none;" @click="isCodeLogin = true">
                {{ t('otherLogin') }}
              </el-button>
              <div style="display:flex;justify-content:center;gap:14px;margin-top:8px;">
                <el-link icon="el-icon-message" type="success"></el-link>
                <el-link icon="el-icon-user" type="primary"></el-link>
              </div>
            </template>
            <template v-else>
              <h2 style="margin-bottom:8px;">{{ t('registerTitle') }}</h2>
              <div style="margin-bottom:16px;">
                <span>{{ t('hasAccount') }}</span>
                <el-link type="primary" style="margin-left:4px;" @click="isLogin=true">{{ t('loginNow') }}</el-link>
              </div>
              <el-input v-model="nickname" :placeholder="t('nickname')" class="input-bordered" style="margin-bottom:16px;" />
              <el-input v-model="phone" :placeholder="t('phone')" class="input-bordered" style="margin-bottom:16px;" />
              <el-input v-model="password" :placeholder="t('password')" class="input-bordered" style="margin-bottom:16px;" show-password />
              <el-input v-model="confirmPassword" :placeholder="t('confirmPassword')" class="input-bordered" style="margin-bottom:16px;" show-password />
              <div style="display:flex;gap:8px;margin-bottom:16px;">
                <el-input v-model="regCode" :placeholder="t('code')" class="input-bordered" style="flex:1;" />
                <el-button id="register-code-btn" :disabled="codeBtnDisabled" @click="handleGetCode">{{ codeBtnText }}</el-button>
              </div>
              <el-button type="primary" style="width:100%;margin:0 0 16px 0;padding:10px 0;height:32px;box-sizing:border-box;background:linear-gradient(90deg, #ffb86c 0%, #ff9a8b 100%);border-radius:8px;font-size:18px;font-weight:500;border:none;" @click="handleRegister">
                {{ t('registerBtn') }}
              </el-button>
              <div style="display:flex;justify-content:center;gap:16px;margin-top:8px;">
                <el-link icon="el-icon-message" type="success"></el-link>
                <el-link icon="el-icon-user" type="primary"></el-link>
              </div>
            </template>
          </div>
          <div class="illustration">
            <div class="illustration-grid">
              <div class="illustration-card">
                <img src="assets/simulation/plan1.jpg" alt="面部轮廓优化">
                <div class="illustration-card-text">
                  <h4>面部轮廓优化</h4>
                  <p>打造完美V型脸，提升面部立体感</p>
                </div>
              </div>
              <div class="illustration-card">
                <img src="assets/simulation/plan2.jpg" alt="五官精致化">
                <div class="illustration-card-text">
                  <h4>五官精致化</h4>
                  <p>优化五官比例，提升面部协调性</p>
                </div>
              </div>
              <div class="illustration-card">
                <img src="assets/simulation/plan3.jpg" alt="面部年轻化">
                <div class="illustration-card-text">
                  <h4>面部年轻化</h4>
                  <p>改善面部松弛，恢复年轻状态</p>
                </div>
              </div>
              <div class="illustration-card">
                <img src="assets/simulation/plan4.jpg" alt="综合美颜">
                <div class="illustration-card-text">
                  <h4>综合美颜</h4>
                  <p>全方位改善，打造自然和谐美感</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else-if="isCodeLogin && !isForgotPassword">
        <div class="header-bar">
          <div style="font-weight:bold;font-size:20px;">{{ t('otherLogin') }}</div>
          <el-link type="primary" @click="isCodeLogin=false" style="font-size:15px;">返回</el-link>
        </div>
        <div class="app-container">
          <div class="login-panel">
            <h2 style="margin-bottom:8px;">{{ t('otherLogin') }}</h2>
            <div style="display:flex;gap:8px;margin-bottom:16px;">
              <el-button :class="{active: codeType==='phone'}" @click="codeType='phone'" style="flex:1;background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);color:#fff;border-radius:20px;font-weight:500;">手机验证码</el-button>
              <el-button :class="{active: codeType==='email'}" @click="codeType='email'" style="flex:1;background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);color:#fff;border-radius:20px;font-weight:500;">邮箱验证码</el-button>
            </div>
            <el-input v-if="codeType==='phone'" v-model="loginPhone" placeholder="请输入手机号" class="input-bordered" style="margin-bottom:16px;" />
            <el-input v-else v-model="loginEmail" placeholder="请输入邮箱" class="input-bordered" style="margin-bottom:16px;" />
            <div style="display:flex;gap:8px;margin-bottom:16px;">
              <el-input v-model="loginCode" :placeholder="t('code')" class="input-bordered" style="flex:1;" />
              <el-button id="login-by-code-btn" :disabled="codeBtnDisabled" @click="handleGetCodeForCodeLogin">{{ codeBtnText }}</el-button>
            </div>
            <el-button type="primary" style="width:100%;margin:0 0 16px 0;padding:10px 0;height:32px;box-sizing:border-box;background:linear-gradient(90deg, #21d4fd 0%, #b721ff 100%);border-radius:8px;font-size:18px;font-weight:500;border:none;" @click="handleLogin">登录</el-button>
            <el-link type="primary" @click="isLogin=true;isCodeLogin=false" style="margin-left:4px;">{{ t('loginNow') }}</el-link>
          </div>
          <div class="illustration"></div>
        </div>
      </template>
      <template v-else-if="isForgotPassword">
        <div class="header-bar">
          <div style="font-weight:bold;font-size:20px;">找回密码</div>
          <el-link type="primary" @click="resetForgotPasswordForm" style="font-size:15px;">返回</el-link>
        </div>
        <div class="app-container">
          <div class="login-panel">
            <h2 style="margin-bottom:24px;text-align:center;">找回密码</h2>
            
            <!-- 步骤1：选择找回方式 -->
            <template v-if="forgotPasswordStep === 1">
              <div style="margin-bottom:24px;text-align:center;">
                <div style="font-size:16px;margin-bottom:16px;">请选择找回方式</div>
                <div style="display:flex;gap:8px;margin-bottom:16px;">
                  <el-button 
                    :class="{active: forgotPasswordMethod==='phone'}" 
                    @click="forgotPasswordMethod='phone'" 
                    style="flex:1;background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);color:#fff;border-radius:20px;font-weight:500;border:none;"
                  >
                    手机找回
                  </el-button>
                  <el-button 
                    :class="{active: forgotPasswordMethod==='email'}" 
                    @click="forgotPasswordMethod='email'" 
                    style="flex:1;background: linear-gradient(135deg, #21d4fd 0%, #b721ff 100%);color:#fff;border-radius:20px;font-weight:500;border:none;"
                  >
                    邮箱找回
                  </el-button>
                </div>
                <el-input 
                  v-if="forgotPasswordMethod==='phone'" 
                  v-model="forgotPasswordPhone" 
                  placeholder="请输入手机号" 
                  class="input-bordered" 
                  style="margin-bottom:16px;" 
                />
                <el-input 
                  v-else 
                  v-model="forgotPasswordEmail" 
                  placeholder="请输入邮箱" 
                  class="input-bordered" 
                  style="margin-bottom:16px;" 
                />
              </div>
            </template>
            
            <!-- 步骤2：输入验证码 -->
            <template v-else-if="forgotPasswordStep === 2">
              <div style="margin-bottom:24px;text-align:center;">
                <div style="font-size:16px;margin-bottom:16px;">
                  验证码已发送至您的{{ forgotPasswordMethod === 'phone' ? '手机' : '邮箱' }}
                </div>
                <div style="font-size:15px;color:#666;margin-bottom:16px;">
                  {{ forgotPasswordMethod === 'phone' ? forgotPasswordPhone : forgotPasswordEmail }}
                </div>
                <div style="display:flex;gap:8px;margin-bottom:16px;">
                  <el-input v-model="forgotPasswordCode" placeholder="请输入验证码" class="input-bordered" style="flex:1;" />
                  <el-button id="forgot-password-code-btn" :disabled="codeBtnDisabled" @click="handleGetCodeForForgotPassword">{{ codeBtnText }}</el-button>
                </div>
              </div>
            </template>
            
            <!-- 步骤3：重置密码 -->
            <template v-else-if="forgotPasswordStep === 3">
              <div style="margin-bottom:24px;">
                <div style="font-size:16px;margin-bottom:16px;text-align:center;">设置新密码</div>
                <el-input v-model="newPassword" type="password" placeholder="新密码" class="input-bordered" style="margin-bottom:16px;" />
                <el-input v-model="confirmNewPassword" type="password" placeholder="确认新密码" class="input-bordered" style="margin-bottom:16px;" />
              </div>
            </template>
            
            <!-- 步骤按钮 -->
            <el-button 
              type="primary" 
              style="width:100%;margin:0 0 16px 0;padding:10px 0;height:32px;box-sizing:border-box;background:linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);border-radius:8px;font-size:18px;font-weight:500;border:none;" 
              @click="handleNextStep"
            >
              {{ forgotPasswordStep === 3 ? '完成' : '下一步' }}
            </el-button>
            
            <el-button 
              style="width:100%;margin:0;padding:10px 0;height:32px;box-sizing:border-box;background:#f0f0f0;color:#666;border-radius:8px;font-size:18px;font-weight:500;border:none;" 
              @click="resetForgotPasswordForm"
            >
              取消
            </el-button>
          </div>
          <div class="illustration"></div>
        </div>
      </template>
      <template v-else-if="currentPage === 'main'">
        <div class="main-layout">
          <aside class="main-sider">
            <div class="sider-avatar">
              <img :src="userInfo.avatar" class="user-avatar" style="width:48px;height:48px;border-radius:50%;object-fit:cover;" />
            </div>
            <ul class="sider-menu">
              <li v-for="item in navItems" :key="item.key" :class="{active: navActive === item.key}" @click="item.onClick ? item.onClick() : (navActive = item.key)">
                <i :class="item.icon"></i>
                <span class="custom-tooltip">{{ item.tooltip }}</span>
              </li>
            </ul>
            <div class="sider-logout">
              <el-tooltip :content="t('navLogout')" placement="right" effect="dark">
                <el-button circle @click="handleLogout">
                  <i class="fas fa-sign-out-alt"></i>
                </el-button>
              </el-tooltip>
            </div>
          </aside>
          <div class="main-content">
            <div class="main-header">
              <div class="main-title">{{ 
                navActive === 'home' ? t('welcome') : 
                navActive === 'ai' ? t('navAI') : 
                navActive === 'history' ? (globalState.lang === 'zh' ? '历史分析记录' : 'Analysis History') :
                navActive === 'user' ? t('navUser') : 
                navActive === 'predict' ? (globalState.lang === 'zh' ? '上传照片进行分析' : 'Upload Photos for Analysis') : '' 
              }}</div>
              <div style="display:flex;gap:16px;align-items:center;">
                <el-dropdown @command="val => globalState.lang = val">
                  <span class="el-dropdown-link" :class="{'lang-bright': globalState.theme === 'theme-dark'}" style="cursor:pointer;display:flex;align-items:center;">
                    <span style="margin:0 4px;">{{ t('lang') }}</span> <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item v-for="item in langOptions" :key="item.value" :command="item.value">
                        {{ item.label }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
                <el-dropdown @command="val => globalState.theme = val">
                  <span class="el-dropdown-link" :class="{'theme-bright': globalState.theme === 'theme-dark'}" style="cursor:pointer;display:flex;align-items:center;">
                    <span style="margin:0 4px;">{{ t('theme') }}</span> <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item v-for="item in themeOptions" :key="item.value" :command="item.value">
                        {{ item.label }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
                <el-link icon="el-icon-user" type="primary"></el-link>
              </div>
            </div>
            <div class="main-body">
              <template v-if="navActive === 'home'">
                <div class="main-home-container">
                  <!-- 左侧内容区域 -->
                <div class="main-center">
                    <!-- 标题部分 -->
                    <div class="main-title-section">
                      <div class="main-big-title" style="font-weight:bold;color:#222;letter-spacing:2px;text-shadow:2px 2px 0 #e0e6f6, 4px 4px 0 #b3b3b3;">FURE<br/>FACE</div>
                  <div class="main-sub">{{ t('mainSub') }}</div>
                  <div class="main-desc">{{ t('mainDesc') }}</div>
                  <div class="main-btns">
                        <el-button type="warning" style="width:120px;height:48px;font-size:16px;background:linear-gradient(135deg, #ffb86c 0%, #ff9a8b 100%);border-radius:24px;border:none;box-shadow:0 4px 12px rgba(255,184,108,0.3);" @click="handlePredictClick">{{ t('mainBtn1') }}</el-button>
                        <el-button type="primary" style="width:120px;height:48px;font-size:16px;background:linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);border-radius:24px;border:none;box-shadow:0 4px 12px rgba(79,172,254,0.3);">{{ t('mainBtn2') }}</el-button>
                  </div>
                </div>
                  </div>
                  
                  <!-- 特性卡片移至右侧 -->
                  <div class="main-features-container">
                    <h2 style="margin-top:0;margin-bottom:20px;text-align:center;color:#333;font-size:24px;">核心功能</h2>
                    <div class="main-features">
                      <div class="feature-card" style="border-left:4px solid #ff9a8b;">
                        <h3 style="color:#ff9a8b;">精准分析</h3>
                        <p>基于深度学习的面部特征分析技术，提供精准的面部评估。</p>
                      </div>
                      <div class="feature-card" style="border-left:4px solid #4facfe;">
                        <h3 style="color:#4facfe;">智能推荐</h3>
                        <p>根据个人面部特征，提供个性化的改善方案和建议。</p>
                      </div>
                      <div class="feature-card" style="border-left:4px solid #b721ff;">
                        <h3 style="color:#b721ff;">AI助手</h3>
                        <p>24小时在线的智能助手，解答您所有关于面部分析的问题。</p>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else-if="navActive === 'pageB'">
                <div class="main-center">
                  <div class="main-big-title">上传照片</div>
                  <div class="main-sub">AI智能检测你的照片</div>
                  <div class="main-desc">支持多种检测算法和案例展示</div>
                  <div class="main-btns">
                    <el-button type="primary" style="width:120px;">上传照片</el-button>
                    <el-button type="success" style="width:120px;">查看案例</el-button>
                  </div>
                </div>
              </template>
              <template v-else-if="navActive === 'ai'">
                <div class="ai-assistant-container large-ai" style="margin:40px auto; min-height: 440px;">
                  <div class="ai-header">AI智能助手</div>
                  <div class="ai-chat-window" ref="chatWindow">
                    <div v-for="msg in messages" :key="msg.id" :class="['ai-bubble', msg.role]">
                      <span v-if="msg.role==='user'" class="ai-user">我：</span>
                      <span v-if="msg.role==='assistant'" class="ai-assistant">AI：</span>
                      <span>{{ msg.content }}</span>
                    </div>
                  </div>
                  <div class="ai-input-bar-container"> <!-- 新增一个容器来包裹提示和输入栏 -->
                    <div class="ai-disclaimer">
                      本回答仅供参考，不能替代专业医疗建议。
                  </div>
                  <div class="ai-input-bar">
                    <el-input v-model="inputMsg" placeholder="请输入您的问题..." @keyup.enter="sendMsg" :disabled="isThinking" />
                    <el-button type="primary" @click="sendMsg" :loading="isThinking" :disabled="isThinking">{{ isThinking ? '思考中' : '发送' }}</el-button>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else-if="navActive === 'user'">
                <div class="user-info-page">
                  <div class="user-card">
                    <div class="user-avatar-box" @click="openAvatarCropper">
                      <img class="user-avatar" :src="userInfo.avatar" />
                    </div>
                    
                    <div class="user-section-title">基础信息设置</div>
                    
                    <!-- 昵称 -->
                    <div class="user-form-row">
                      <el-input v-model="userInfo.nickname" placeholder="昵称" prefix-icon="el-icon-edit" />
                      <button class="form-action-btn" @click="saveNickname" v-if="userInfo.nickname">
                        保存
                      </button>
                    </div>
                    
                    <!-- 性别选择 -->
                    <div class="user-form-row">
                      <el-select v-model="userInfo.gender" :placeholder="t('gender')" style="width: 100%;">
                        <el-option :label="t('genderMale')" value="男"></el-option>
                        <el-option :label="t('genderFemale')" value="女"></el-option>
                        <el-option :label="t('genderSecret')" value="保密"></el-option>
                      </el-select>
                    </div>
                    
                    <!-- 密码修改 -->
                    <div v-if="!isEditingPassword" class="user-form-row">
                      <el-input v-model="userInfo.password" placeholder="密码" prefix-icon="el-icon-lock" show-password disabled />
                      <button class="form-action-btn" @click="startEditPassword">
                        修改
                      </button>
                    </div>
                    
                    <!-- 密码修改表单 -->
                    <template v-if="isEditingPassword">
                    <div class="user-form-row">
                        <el-input v-model="originalPassword" :placeholder="t('originalPassword')" prefix-icon="el-icon-lock" show-password />
                    </div>
                    <div class="user-form-row">
                        <el-input v-model="newPassword" :placeholder="t('newPassword')" prefix-icon="el-icon-lock" show-password />
                    </div>
                    <div class="user-form-row">
                        <el-input v-model="confirmNewPassword" :placeholder="t('confirmNewPassword')" prefix-icon="el-icon-lock" show-password />
                    </div>
                      <div class="user-form-row" style="display:flex;gap:10px;">
                        <el-button type="primary" @click="savePassword" style="flex:1;">{{ globalState.lang === 'zh' ? '保存' : 'Save' }}</el-button>
                        <el-button @click="cancelEditPassword" style="flex:1;">{{ globalState.lang === 'zh' ? '取消' : 'Cancel' }}</el-button>
                      </div>
                    </template>
                    
                    <div class="user-section-title">绑定信息</div>
                    
                    <!-- 手机号换绑 -->
                    <div v-if="!isBindingPhone" class="user-form-row">
                      <el-input v-model="userInfo.phone" placeholder="手机号" prefix-icon="el-icon-phone" disabled />
                      <button class="form-action-btn" @click="startBindPhone">
                        {{ userInfo.phone ? '换绑' : '绑定' }}
                      </button>
                    </div>
                    
                    <!-- 手机号换绑表单 -->
                    <template v-if="isBindingPhone">
                      <div class="user-form-row">
                        <el-input v-model="newPhone" placeholder="新手机号" prefix-icon="el-icon-phone" />
                      </div>
                      <div class="user-form-row" style="display:flex;gap:8px;">
                        <el-input v-model="verifyCode" placeholder="验证码" style="flex:1;" />
                        <el-button id="user-info-phone-code-btn" :disabled="codeBtnDisabled" @click="getVerifyCode('phone')">{{ codeBtnText }}</el-button>
                      </div>
                      <div class="user-form-row" style="display:flex;gap:10px;">
                        <el-button type="primary" @click="savePhone" style="flex:1;">保存</el-button>
                        <el-button @click="cancelBindPhone" style="flex:1;">取消</el-button>
                      </div>
                    </template>
                    
                    <!-- 邮箱换绑 -->
                    <div v-if="!isBindingEmail" class="user-form-row">
                      <el-input v-model="userInfo.email" placeholder="邮箱" prefix-icon="el-icon-message" disabled />
                      <button class="form-action-btn" @click="startBindEmail">
                        {{ userInfo.email ? '换绑' : '绑定' }}
                      </button>
                    </div>
                    
                    <!-- 邮箱换绑表单 -->
                    <template v-if="isBindingEmail">
                      <div class="user-form-row">
                        <el-input v-model="newEmail" placeholder="新邮箱" prefix-icon="el-icon-message" />
                      </div>
                      <div class="user-form-row" style="display:flex;gap:8px;">
                        <el-input v-model="verifyCode" placeholder="验证码" style="flex:1;" />
                        <el-button id="user-info-email-code-btn" :disabled="codeBtnDisabled" @click="getVerifyCode('email')">{{ codeBtnText }}</el-button>
                      </div>
                      <div class="user-form-row" style="display:flex;gap:10px;">
                        <el-button type="primary" @click="saveEmail" style="flex:1;">保存</el-button>
                        <el-button @click="cancelBindEmail" style="flex:1;">取消</el-button>
                      </div>
                    </template>
                  </div>
                </div>
              </template>
              <template v-else-if="navActive === 'predict'">
                <div class="upload-section">
                  <div class="container">
                    <h2>上传照片</h2>
                    <div class="upload-guide">
                      <div class="guide-image">
                        <img src="assets/guide-front.jpg" alt="正面拍摄指南">
                        <img src="assets/guide-side.jpg" alt="侧面拍摄指南">
                      </div>
                      <div class="guide-text">
                        <h3>拍摄要求</h3>
                        <ul>
                          <li>光线充足，面部清晰可见</li>
                          <li>保持自然表情，无妆面</li>
                          <li>头发不遮挡面部</li>
                          <li>保持适当距离，确保面部完整入镜</li>
                        </ul>
                      </div>
                    </div>
                    <div class="upload-area">
                      <div class="upload-box" id="frontUpload">
                        <div class="upload-placeholder">
                          <span>正面照片</span>
                        </div>
                        <div class="preview-container" style="display: none;">
                          <img id="frontPreview" src="" alt="正面预览">
                          <button class="reupload-btn">重新上传</button>
                        </div>
                        <input type="file" id="frontInput" accept="image/*" style="display: none;">
                      </div>
                      <div class="upload-box" id="sideUpload">
                        <div class="upload-placeholder">
                          <span>侧面照片</span>
                        </div>
                        <div class="preview-container" style="display: none;">
                          <img id="sidePreview" src="" alt="侧面预览">
                          <button class="reupload-btn">重新上传</button>
                        </div>
                        <input type="file" id="sideInput" accept="image/*" style="display: none;">
                      </div>
                    </div>
                    <div class="progress-container" id="progressContainer" hidden>
                      <div class="progress-bar">
                        <div class="progress-fill" id="progressFill"></div>
                      </div>
                      <p class="progress-text">正在分析中...</p>
                    </div>
                    <button class="analyze-button" id="analyzeButton" disabled>开始分析</button>
                  </div>
                </div>
              

              </template>
              <template v-else-if="navActive === 'history'">
                <div class="analysis-history-container">
                  <h2 v-if="globalState.lang === 'zh'">历史分析记录</h2>
                  <h2 v-else>Analysis History</h2>
                  <div v-if="analysisHistory.length === 0" class="empty-history">
                    <p v-if="globalState.lang === 'zh'">暂无分析记录，快去<el-link type="primary" @click="navActive='predict'">预测区</el-link>试试吧！</p>
                    <p v-else>No analysis records yet, go to the <el-link type="primary" @click="navActive='predict'">Prediction Area</el-link> and try it out!</p>
            </div>
                  <div v-else class="history-list">
                    <div v-for="record in analysisHistory" :key="record.id" class="history-card">
                      <div class="history-card-header">
                        <span>{{ record.date }}</span>
                      </div>
                      <div class="history-card-body">
                        <div class="history-images">
                          <div>
                            <p v-if="globalState.lang === 'zh'">正面照片</p><p v-else>Front Photo</p>
                            <img :src="record.frontImage" alt="Front Photo" />
                          </div>
                          <div>
                            <p v-if="globalState.lang === 'zh'">侧面照片</p><p v-else>Side Photo</p>
                            <img :src="record.sideImage" alt="Side Photo" />
                          </div>
                          <div>
                            <p v-if="globalState.lang === 'zh'">预测照片</p><p v-else>Prediction Photo</p>
                            <img :src="record.predictionImage || 'assets/simulation/plan1.jpg'" alt="Prediction Photo" />
                          </div>
                        </div>
                        <div class="history-results">
                          <h4 v-if="globalState.lang === 'zh'">分析概要</h4><h4 v-else>Analysis Summary</h4>
                          <p><strong>{{ globalState.lang === 'zh' ? '面部比例：' : 'Proportions: ' }}</strong>{{ record.summary.proportions }}</p>
                          <p><strong>{{ globalState.lang === 'zh' ? '对称性：' : 'Symmetry: ' }}</strong>{{ record.summary.symmetry }}</p>
                          <h4 style="margin-top:15px;" v-if="globalState.lang === 'zh'">详细建议</h4><h4 style="margin-top:15px;" v-else>Detailed Suggestions</h4>
                          <p>{{ record.details }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </template>
      <template v-if="showAvatarCropper">
        <div class="avatar-cropper-mask">
          <div class="avatar-cropper-box">
            <img :src="avatarPreview" class="avatar-cropper-preview" />
            <div style="margin-top:16px;display:flex;gap:16px;justify-content:center;">
              <el-button type="primary" @click="saveAvatar">保存头像</el-button>
              <el-button @click="cancelAvatar">取消</el-button>
            </div>
          </div>
        </div>
      </template>
    </div>
  `
});

app.use(ElementPlus);
app.mount('#app');
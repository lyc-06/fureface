// 通用功能：密码可见性切换（适配所有页面）
document.querySelectorAll('.password i').forEach(icon => {
    icon.addEventListener('click', function() {
        const passwordInput = this.previousElementSibling;
        const isHidden = passwordInput.type === 'password';
        
        // 切换输入类型
        passwordInput.type = isHidden ? 'text' : 'password';
        
        // 切换图标样式
        this.classList.toggle('ri-eye-off-line');
        this.classList.toggle('ri-eye-line');
        
        // 颜色反馈
        this.style.color = isHidden ? 'var(--primary-color)' : 'var(--light-text-color)';
    });
});

// 注册页专属：密码一致性验证
const registerForm = document.querySelector('form');
if (registerForm && document.querySelector('input[placeholder="确认密码"]')) {
    const passwordInput = document.querySelector('input[placeholder="密码"]');
    const confirmInput = document.querySelector('input[placeholder="确认密码"]');
    const errorSpan = document.querySelector('.error-message');

    const validatePasswords = () => {
    const isMatch = passwordInput.value === confirmInput.value;
    const confirmIsEmpty = confirmInput.value.trim() === '';

    // 当确认密码为空时隐藏错误
    errorSpan.style.visibility = (confirmIsEmpty || isMatch) ? 'hidden' : 'visible';
    errorSpan.textContent = isMatch ? '' : '两次输入的密码不一致';
    confirmInput.style.border = (confirmIsEmpty || isMatch) ? '' : '2px solid #e6162d';
};

    // 实时验证
    passwordInput.addEventListener('input', validatePasswords);
    confirmInput.addEventListener('input', validatePasswords);

    // 提交验证
    registerForm.addEventListener('submit', (e) => {
        if (passwordInput.value !== confirmInput.value) {
            e.preventDefault();
            errorSpan.style.visibility = 'visible';
            errorSpan.textContent = '请确保两次密码输入一致';
            confirmInput.focus();
        }
    });
}
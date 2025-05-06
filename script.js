document.addEventListener('DOMContentLoaded', () => {
    // 初始化变量
    let frontPhoto = null;
    let sidePhoto = null;
    let analysisResults = null;
    let currentSimulation = null;

    // DOM元素
    const uploadSection = document.getElementById('uploadSection');
    const frontUpload = document.getElementById('frontUpload');
    const sideUpload = document.getElementById('sideUpload');
    const frontPhotoInput = document.getElementById('frontPhoto');
    const sidePhotoInput = document.getElementById('sidePhoto');
    const analyzeButton = document.getElementById('analyzeButton');
    const progressContainer = document.querySelector('.progress-container');
    const progressFill = document.querySelector('.progress-fill');
    const analysisSection = document.getElementById('analysisSection');

    // 照片上传处理
    function handlePhotoUpload(input, previewId, uploadBox) {
        const file = input.files[0];
        if (file) {
            // 检查文件类型
            if (!file.type.startsWith('image/')) {
                alert('请选择图片文件');
                return;
            }

            // 检查文件大小（限制为5MB）
            if (file.size > 5 * 1024 * 1024) {
                alert('图片大小不能超过5MB');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = document.getElementById(previewId);
                preview.src = e.target.result;
                preview.parentElement.hidden = false;
                uploadBox.querySelector('.upload-placeholder').hidden = true;
                
                // 更新分析按钮状态
                if (previewId === 'frontPreview') {
                    frontPhoto = file;
                } else {
                    sidePhoto = file;
                }
                updateAnalyzeButton();
            };
            reader.readAsDataURL(file);
        }
    }

    // 重新上传按钮处理
    function handleReupload(previewId, uploadBox) {
        const preview = document.getElementById(previewId);
        preview.src = '';
        preview.parentElement.hidden = false;
        uploadBox.querySelector('.upload-placeholder').hidden = false;
        
        if (previewId === 'frontPreview') {
            frontPhoto = null;
        } else {
            sidePhoto = null;
        }
        updateAnalyzeButton();
    }

    // 更新分析按钮状态
    function updateAnalyzeButton() {
        analyzeButton.disabled = !(frontPhoto && sidePhoto);
    }

    // 上传框点击事件
    frontUpload.addEventListener('click', () => {
        frontPhotoInput.click();
    });

    sideUpload.addEventListener('click', () => {
        sidePhotoInput.click();
    });

    // 文件输入变化事件
    frontPhotoInput.addEventListener('change', () => {
        handlePhotoUpload(frontPhotoInput, 'frontPreview', frontUpload);
    });

    sidePhotoInput.addEventListener('change', () => {
        handlePhotoUpload(sidePhotoInput, 'sidePreview', sideUpload);
    });

    // 重新上传按钮事件
    document.querySelectorAll('.reupload-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const previewId = e.target.parentElement.querySelector('img').id;
            const uploadBox = e.target.closest('.upload-box');
            handleReupload(previewId, uploadBox);
        });
    });

    // 分析按钮点击事件
    analyzeButton.addEventListener('click', async () => {
        if (!frontPhoto || !sidePhoto) return;

        // 显示进度条
        progressContainer.hidden = false;
        progressFill.style.width = '0%';

        try {
            // 模拟分析过程
            await simulateAnalysis();
            
            // 显示分析结果
            showAnalysisResults();
            
            // 滚动到分析结果区域
            analysisSection.hidden = false;
            analysisSection.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('分析过程出错:', error);
            alert('分析过程中出现错误，请重试。');
        }
    });

    // 模拟分析过程
    async function simulateAnalysis() {
        return new Promise((resolve) => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += 5;
                progressFill.style.width = `${progress}%`;
                
                if (progress >= 100) {
                    clearInterval(interval);
                    resolve();
                }
            }, 200);
        });
    }

    // 显示分析结果
    function showAnalysisResults() {
        // 模拟分析结果数据
        analysisResults = {
            facialProportions: {
                goldenRatio: 1.618,
                deviation: 0.05
            },
            symmetry: {
                overall: 0.92,
                details: {
                    eyes: 0.95,
                    nose: 0.88,
                    mouth: 0.90
                }
            },
            skinAnalysis: {
                texture: '良好',
                tone: '均匀',
                concerns: ['轻微干燥', '局部暗沉']
            },
            recommendations: [
                {
                    name: '面部轮廓优化',
                    description: '通过微调面部轮廓，提升整体协调性',
                    intensity: 0.7
                },
                {
                    name: '肤质改善方案',
                    description: '针对性的护肤方案，改善肤质问题',
                    intensity: 0.5
                }
            ]
        };

        // 更新分析结果UI
        updateAnalysisUI();
    }

    // 更新分析结果UI
    function updateAnalysisUI() {
        // 更新面部比例图表
        const goldenRatioChart = document.querySelector('.golden-ratio-chart');
        // 这里可以添加图表库的初始化代码

        // 更新对称性分析图表
        const symmetryChart = document.querySelector('.symmetry-chart');
        // 这里可以添加图表库的初始化代码

        // 更新详细分析内容
        const detailsContent = document.querySelector('.details-content');
        detailsContent.innerHTML = `
            <div class="skin-analysis">
                <h4>肤质分析</h4>
                <p>整体肤质：${analysisResults.skinAnalysis.texture}</p>
                <p>肤色均匀度：${analysisResults.skinAnalysis.tone}</p>
                <h5>主要问题：</h5>
                <ul>
                    ${analysisResults.skinAnalysis.concerns.map(concern => `<li>${concern}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    // 详细分析切换
    const toggleDetails = document.querySelector('.toggle-details');
    const detailsContent = document.querySelector('.details-content');
    
    toggleDetails.addEventListener('click', () => {
        const isHidden = detailsContent.hidden;
        detailsContent.hidden = !isHidden;
        toggleDetails.textContent = isHidden ? '收起详细分析' : '查看详细分析';
    });

    // 初始化FAQ
    const faqList = document.querySelector('.faq-list');
    const faqItems = [
        {
            question: '这个系统是如何工作的？',
            answer: '系统通过AI技术分析您的面部特征，提供专业的美容建议和效果模拟。'
        },
        {
            question: '我的照片会被保存吗？',
            answer: '不会。所有照片都经过加密处理，分析完成后立即删除。'
        },
        {
            question: '分析结果准确吗？',
            answer: '系统提供的是参考建议，实际效果可能因个人情况而异。建议咨询专业医师。'
        }
    ];

    faqItems.forEach(item => {
        const faqItem = document.createElement('div');
        faqItem.className = 'faq-item';
        faqItem.innerHTML = `
            <h4>${item.question}</h4>
            <p>${item.answer}</p>
        `;
        faqList.appendChild(faqItem);
    });

    // 初始化放大镜效果
    function initializeMagnifier() {
        const images = document.querySelectorAll('.simulation-image');
        
        images.forEach(image => {
            const img = image.querySelector('img');
            const magnifier = document.createElement('div');
            magnifier.className = 'magnifier';
            image.appendChild(magnifier);

            image.addEventListener('mousemove', (e) => {
                const rect = image.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // 计算放大镜位置
                const magnifierX = x - magnifier.offsetWidth / 2;
                const magnifierY = y - magnifier.offsetHeight / 2;
                
                // 设置放大镜位置
                magnifier.style.left = `${magnifierX}px`;
                magnifier.style.top = `${magnifierY}px`;
                
                // 计算背景位置
                const bgX = (x / img.offsetWidth) * 100;
                const bgY = (y / img.offsetHeight) * 100;
                
                // 设置放大镜背景
                magnifier.style.backgroundImage = `url(${img.src})`;
                magnifier.style.backgroundSize = `${img.offsetWidth * 2}px ${img.offsetHeight * 2}px`;
                magnifier.style.backgroundPosition = `${bgX}% ${bgY}%`;
            });

            image.addEventListener('mouseleave', () => {
                magnifier.style.display = 'none';
            });

            image.addEventListener('mouseenter', () => {
                magnifier.style.display = 'block';
            });
        });
    }

    // 初始化所有功能
    initializeMagnifier();
}); 
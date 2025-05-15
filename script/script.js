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
    analyzeButton.addEventListener('click', () => {
        if (!frontPhoto || !sidePhoto) return;

        // 直接显示分析结果
        analysisResults = {
            facialProportions: {
                goldenRatio: 1.618,
                deviation: 0.03,
                facialIndex: 0.92,
                measurements: {
                    forehead: 0.33,
                    midface: 0.34,
                    lowerFace: 0.33
                },
                description: {
                    goldenRatio: "仅从图片难以精确测量，但直观来看，面部五官分布较为协调。额头、中庭（鼻）、下庭（唇 - 下巴）比例无明显失调，与黄金比例偏差较小。",
                    facialIndex: "侧面轮廓线条柔和，下颌角角度自然，面部宽窄比例适中，整体轮廓流畅，符合大众审美标准。"
                }
            },
            symmetry: {
                overall: 0.95,
                description: "正面看面部整体对称度较好，无明显左右大小脸情况。",
                details: {
                    eyes: 0.96,
                    nose: 0.94,
                    mouth: 0.93,
                    jawline: 0.95,
                    descriptions: {
                        eyes: "双眼眼型、大小相似，间距适中，对称度高。",
                        nose: "鼻梁基本处于面部中轴线上，鼻翼两侧宽度无明显差异，对称度良好。",
                        mouth: "嘴角位置基本一致，唇部形态左右对称度尚可。"
                    }
                }
            },
            skinAnalysis: {
                texture: '良好',
                tone: '局部不均匀',
                moisture: 0.75,
                elasticity: 0.85,
                evenness: 0.70,
                description: {
                    moisture: "从图片看，皮肤有一定光泽度，说明水分含量尚可，但局部可能因光线原因略显暗沉，整体水分分布可进一步优化。",
                    elasticity: "面部皮肤未见明显松弛迹象，推测弹性指数正常。",
                    evenness: "存在一定程度的色斑，影响了肤色均匀度，是主要问题所在。"
                },
                concerns: ['局部色斑', '轻微暗沉', '肤色不均匀']
            },
            recommendations: [
                {
                    name: '非手术类改善方案',
                    description: '通过专业护理改善肤质问题，提升面部整体状态',
                    intensity: 0.6,
                    procedures: ['光子嫩肤', '果酸换肤', '美白护理'],
                    details: '可定期进行美白、淡斑类的皮肤护理项目，帮助改善色斑问题，提升肤色均匀度。日常加强防晒，防止色斑加深。'
                },
                {
                    name: '手术类改善方案',
                    description: '通过微创手术优化面部轮廓，提升立体感',
                    intensity: 0.4,
                    procedures: ['鼻部微调', '面部轮廓优化'],
                    details: '若追求更精致的面部比例，可考虑对鼻部进行微调，如通过注射或手术方式适度增加鼻梁高度，让面部更具立体感。'
                }
            ]
        };

        // 显示分析结果
        updateAnalysisUI();
        
        // 显示方案展示与效果模拟部分
        const planShowcaseSection = document.querySelector('.plan-showcase-section');
        if (planShowcaseSection) {
            planShowcaseSection.hidden = false;
        }
        
        // 滚动到分析结果区域
        const analysisSection = document.getElementById('analysisSection');
        if (analysisSection) {
            analysisSection.scrollIntoView({ behavior: 'smooth' });
        }
    });

    // 显示分析结果
    function showAnalysisResults() {
        // 更新分析结果UI
        updateAnalysisUI();
        initializeCharts();
        updateDetailedAnalysis();
    }

    // 初始化图表
    function initializeCharts() {
        // 面部比例图表
        const proportionsCtx = document.getElementById('proportionsChart').getContext('2d');
        new Chart(proportionsCtx, {
            type: 'radar',
            data: {
                labels: ['额头比例', '中面部比例', '下面部比例'],
                datasets: [{
                    label: '实际比例',
                    data: [
                        analysisResults.facialProportions.measurements.forehead,
                        analysisResults.facialProportions.measurements.midface,
                        analysisResults.facialProportions.measurements.lowerFace
                    ],
                    backgroundColor: 'rgba(5, 107, 217, 0.2)',
                    borderColor: 'rgba(5, 107, 217, 1)',
                    pointBackgroundColor: 'rgba(5, 107, 217, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(5, 107, 217, 1)'
                }]
            },
            options: {
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 1,
                        ticks: {
                            stepSize: 0.2
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });

        // 对称性分析图表
        const symmetryCtx = document.getElementById('symmetryChart').getContext('2d');
        new Chart(symmetryCtx, {
            type: 'bar',
            data: {
                labels: ['眼睛', '鼻子', '嘴巴', '下颌线'],
                datasets: [{
                    label: '对称度',
                    data: [
                        analysisResults.symmetry.details.eyes,
                        analysisResults.symmetry.details.nose,
                        analysisResults.symmetry.details.mouth,
                        analysisResults.symmetry.details.jawline
                    ],
                    backgroundColor: 'rgba(5, 107, 217, 0.6)',
                    borderColor: 'rgba(5, 107, 217, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 1,
                        ticks: {
                            stepSize: 0.2
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });

        // 肤质分析图表
        const skinCtx = document.getElementById('skinQualityChart').getContext('2d');
        new Chart(skinCtx, {
            type: 'doughnut',
            data: {
                labels: ['水分', '弹性', '均匀度'],
                datasets: [{
                    data: [
                        analysisResults.skinAnalysis.moisture,
                        analysisResults.skinAnalysis.elasticity,
                        analysisResults.skinAnalysis.evenness
                    ],
                    backgroundColor: [
                        'rgba(5, 107, 217, 0.6)',
                        'rgba(76, 175, 80, 0.6)',
                        'rgba(255, 152, 0, 0.6)'
                    ],
                    borderColor: [
                        'rgba(5, 107, 217, 1)',
                        'rgba(76, 175, 80, 1)',
                        'rgba(255, 152, 0, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // 更新分析结果UI
    function updateAnalysisUI() {
        // 更新面部比例数值
        document.getElementById('goldenRatioValue').textContent = 
            `${(analysisResults.facialProportions.deviation * 100).toFixed(1)}%`;
        document.getElementById('facialIndexValue').textContent = 
            `${(analysisResults.facialProportions.facialIndex * 100).toFixed(1)}%`;

        // 更新对称性数值
        document.getElementById('overallSymmetryValue').textContent = 
            `${(analysisResults.symmetry.overall * 100).toFixed(1)}%`;
        document.getElementById('eyeSymmetryValue').textContent = 
            `${(analysisResults.symmetry.details.eyes * 100).toFixed(1)}%`;
        document.getElementById('noseSymmetryValue').textContent = 
            `${(analysisResults.symmetry.details.nose * 100).toFixed(1)}%`;
        document.getElementById('mouthSymmetryValue').textContent = 
            `${(analysisResults.symmetry.details.mouth * 100).toFixed(1)}%`;

        // 更新肤质指标
        document.getElementById('moistureLevel').style.width = 
            `${analysisResults.skinAnalysis.moisture * 100}%`;
        document.getElementById('elasticityLevel').style.width = 
            `${analysisResults.skinAnalysis.elasticity * 100}%`;
        document.getElementById('evennessLevel').style.width = 
            `${analysisResults.skinAnalysis.evenness * 100}%`;

        // 更新肤质问题列表
        const concernsList = document.getElementById('skinConcernsList');
        if (concernsList) {
            concernsList.innerHTML = analysisResults.skinAnalysis.concerns
                .map(concern => `<li>${concern}</li>`)
                .join('');
        }

        // 显示详细分析内容
        const detailsContent = document.querySelector('.details-content');
        if (detailsContent) {
            detailsContent.hidden = false;
        }

        // 更新标签页内容
        updateTabContent('facial-tab', generateFacialAnalysisContent());
        updateTabContent('skin-tab', generateSkinAnalysisContent());
        updateTabContent('recommendations-tab', generateRecommendationsContent());

        // 初始化图表
        initializeCharts();

        // 更新详细分析按钮文本
        const toggleDetailsBtn = document.querySelector('.toggle-details');
        if (toggleDetailsBtn) {
            toggleDetailsBtn.textContent = '收起详细分析';
        }

        // 确保分析结果区域可见
        const analysisSection = document.getElementById('analysisSection');
        if (analysisSection) {
            analysisSection.hidden = false;
        }
    }

    // 更新详细分析内容
    function updateDetailedAnalysis() {
        // 更新数值显示
        document.getElementById('goldenRatioValue').textContent = 
            `${(analysisResults.facialProportions.deviation * 100).toFixed(1)}%`;
        document.getElementById('facialIndexValue').textContent = 
            `${(analysisResults.facialProportions.facialIndex * 100).toFixed(1)}%`;
        document.getElementById('overallSymmetryValue').textContent = 
            `${(analysisResults.symmetry.overall * 100).toFixed(1)}%`;
        document.getElementById('eyeSymmetryValue').textContent = 
            `${(analysisResults.symmetry.details.eyes * 100).toFixed(1)}%`;
        document.getElementById('noseSymmetryValue').textContent = 
            `${(analysisResults.symmetry.details.nose * 100).toFixed(1)}%`;
        document.getElementById('mouthSymmetryValue').textContent = 
            `${(analysisResults.symmetry.details.mouth * 100).toFixed(1)}%`;

        // 更新肤质指标
        document.getElementById('moistureLevel').style.width = 
            `${analysisResults.skinAnalysis.moisture * 100}%`;
        document.getElementById('elasticityLevel').style.width = 
            `${analysisResults.skinAnalysis.elasticity * 100}%`;
        document.getElementById('evennessLevel').style.width = 
            `${analysisResults.skinAnalysis.evenness * 100}%`;

        // 更新肤质问题列表
        const concernsList = document.getElementById('skinConcernsList');
        concernsList.innerHTML = analysisResults.skinAnalysis.concerns
            .map(concern => `<li>${concern}</li>`)
            .join('');

        // 更新详细分析标签页内容
        updateTabContent('facial-tab', generateFacialAnalysisContent());
        updateTabContent('skin-tab', generateSkinAnalysisContent());
        updateTabContent('recommendations-tab', generateRecommendationsContent());
    }

    // 生成面部特征分析内容
    function generateFacialAnalysisContent() {
        return `
            <div class="facial-analysis-content">
                <h4>面部特征详细分析</h4>
                <div class="analysis-grid">
                    <div class="analysis-item">
                        <h5>面部比例</h5>
                        <p>${analysisResults.facialProportions.description.goldenRatio}</p>
                        <p>${analysisResults.facialProportions.description.facialIndex}</p>
                        <ul>
                            <li>额头比例：${(analysisResults.facialProportions.measurements.forehead * 100).toFixed(1)}%</li>
                            <li>中面部比例：${(analysisResults.facialProportions.measurements.midface * 100).toFixed(1)}%</li>
                            <li>下面部比例：${(analysisResults.facialProportions.measurements.lowerFace * 100).toFixed(1)}%</li>
                        </ul>
                    </div>
                    <div class="analysis-item">
                        <h5>面部对称性</h5>
                        <p>${analysisResults.symmetry.description}</p>
                        <ul>
                            <li>眼睛：${analysisResults.symmetry.details.descriptions.eyes}</li>
                            <li>鼻子：${analysisResults.symmetry.details.descriptions.nose}</li>
                            <li>嘴巴：${analysisResults.symmetry.details.descriptions.mouth}</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    // 生成肤质分析内容
    function generateSkinAnalysisContent() {
        return `
            <div class="skin-analysis-content">
                <h4>肤质详细分析</h4>
                <div class="analysis-grid">
                    <div class="analysis-item">
                        <h5>肤质状况</h5>
                        <p>${analysisResults.skinAnalysis.description.moisture}</p>
                        <p>${analysisResults.skinAnalysis.description.elasticity}</p>
                        <p>${analysisResults.skinAnalysis.description.evenness}</p>
                        <div class="metrics-details">
                            <div class="metric-item">
                                <span>水分含量</span>
                                <div class="progress-bar">
                                    <div class="progress" style="width: ${analysisResults.skinAnalysis.moisture * 100}%"></div>
                                </div>
                                <span>${(analysisResults.skinAnalysis.moisture * 100).toFixed(1)}%</span>
                            </div>
                            <div class="metric-item">
                                <span>弹性指数</span>
                                <div class="progress-bar">
                                    <div class="progress" style="width: ${analysisResults.skinAnalysis.elasticity * 100}%"></div>
                                </div>
                                <span>${(analysisResults.skinAnalysis.elasticity * 100).toFixed(1)}%</span>
                            </div>
                            <div class="metric-item">
                                <span>均匀度</span>
                                <div class="progress-bar">
                                    <div class="progress" style="width: ${analysisResults.skinAnalysis.evenness * 100}%"></div>
                                </div>
                                <span>${(analysisResults.skinAnalysis.evenness * 100).toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                    <div class="analysis-item">
                        <h5>主要问题</h5>
                        <ul class="concerns-list">
                            ${analysisResults.skinAnalysis.concerns.map(concern => `
                                <li>
                                    <i class="fas fa-exclamation-circle"></i>
                                    ${concern}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    // 生成改善建议内容
    function generateRecommendationsContent() {
        return `
            <div class="recommendations-content">
                <h4>个性化改善建议</h4>
                <div class="recommendations-grid">
                    ${analysisResults.recommendations.map(rec => `
                        <div class="recommendation-card">
                            <h5>${rec.name}</h5>
                            <p>${rec.description}</p>
                            <p class="recommendation-details">${rec.details}</p>
                            <div class="intensity-meter">
                                <span>方案强度</span>
                                <div class="progress-bar">
                                    <div class="progress" style="width: ${rec.intensity * 100}%"></div>
                                </div>
                                <span>${(rec.intensity * 100).toFixed(0)}%</span>
                            </div>
                            <div class="procedures-list">
                                <h6>具体方案：</h6>
                                <ul>
                                    ${rec.procedures.map(proc => `<li>${proc}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // 更新标签页内容
    function updateTabContent(tabId, content) {
        const tabPane = document.getElementById(tabId);
        if (tabPane) {
            tabPane.innerHTML = content;
        }
    }

    // 标签页切换事件
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            // 移除所有活动状态
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('active');
            });

            // 设置当前标签页为活动状态
            button.classList.add('active');
            const tabId = `${button.dataset.tab}-tab`;
            document.getElementById(tabId).classList.add('active');
        });
    });

    // 优化放大镜效果
    function initializeMagnifier() {
        const images = document.querySelectorAll('.simulation-image');
        
        images.forEach(image => {
            const img = image.querySelector('img');
            const magnifier = document.createElement('div');
            magnifier.className = 'magnifier';
            image.appendChild(magnifier);

            let isMouseOver = false;

            image.addEventListener('mousemove', (e) => {
                if (!isMouseOver) return;

                const rect = image.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // 计算放大镜位置
                const magnifierX = Math.min(
                    Math.max(x - magnifier.offsetWidth / 2, 0),
                    rect.width - magnifier.offsetWidth
                );
                const magnifierY = Math.min(
                    Math.max(y - magnifier.offsetHeight / 2, 0),
                    rect.height - magnifier.offsetHeight
                );
                
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

            image.addEventListener('mouseenter', () => {
                isMouseOver = true;
                magnifier.style.display = 'block';
            });

            image.addEventListener('mouseleave', () => {
                isMouseOver = false;
                magnifier.style.display = 'none';
            });
        });
    }

    // 初始化所有功能
    initializeMagnifier();

    // 详细分析切换按钮事件
    const toggleDetailsBtn = document.querySelector('.toggle-details');
    if (toggleDetailsBtn) {
        toggleDetailsBtn.addEventListener('click', () => {
            const detailsContent = document.querySelector('.details-content');
            if (detailsContent) {
                const isHidden = detailsContent.hidden;
                detailsContent.hidden = !isHidden;
                toggleDetailsBtn.textContent = isHidden ? '收起详细分析' : '查看详细分析';
            }
        });
    }

    // 年龄模拟滑动条切换图片
    const ageSlider = document.getElementById('ageSlider');
    const ageImages = document.querySelectorAll('.age-image');
    if (ageSlider && ageImages.length) {
        ageSlider.addEventListener('input', function() {
            ageImages.forEach((img, idx) => {
                if (parseInt(ageSlider.value) === idx) {
                    img.classList.add('active');
                } else {
                    img.classList.remove('active');
                }
            });
        });
    }
}); 


document.addEventListener('DOMContentLoaded', function() {
    // 上传功能实现
    const frontUpload = document.getElementById('frontUpload');
    const sideUpload = document.getElementById('sideUpload');
    const frontInput = document.getElementById('frontInput');
    const sideInput = document.getElementById('sideInput');
    const frontPreview = document.getElementById('frontPreview');
    const sidePreview = document.getElementById('sidePreview');
    const analyzeButton = document.getElementById('analyzeButton');
    
    // 正面照片上传
    setupUploadBox(frontUpload, frontInput, frontPreview);
    // 侧面照片上传
    setupUploadBox(sideUpload, sideInput, sidePreview);
    
    function setupUploadBox(uploadBox, fileInput, previewImg) {
        const placeholder = uploadBox.querySelector('.upload-placeholder');
        const previewContainer = uploadBox.querySelector('.preview-container');
        const reuploadBtn = uploadBox.querySelector('.reupload-btn');
        
        // 点击上传区域触发文件选择
        uploadBox.addEventListener('click', function(e) {
            if (e.target !== reuploadBtn) {
                fileInput.click();
            }
        });
        
        // 文件选择变化
        fileInput.addEventListener('change', function() {
            if (fileInput.files && fileInput.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    previewImg.src = e.target.result;
                    placeholder.style.display = 'none';
                    previewContainer.style.display = 'flex';
                    checkUploadStatus();
                };
                
                reader.readAsDataURL(fileInput.files[0]);
            }
        });
        
        // 重新上传按钮
        reuploadBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            fileInput.value = '';
            previewImg.src = '';
            placeholder.style.display = 'flex';
            previewContainer.style.display = 'none';
            checkUploadStatus();
        });
        
        // 拖放功能
        uploadBox.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadBox.classList.add('drag-over');
        });
        
        uploadBox.addEventListener('dragleave', function() {
            uploadBox.classList.remove('drag-over');
        });
        
        uploadBox.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadBox.classList.remove('drag-over');
            
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                fileInput.files = e.dataTransfer.files;
                const event = new Event('change');
                fileInput.dispatchEvent(event);
            }
        });
    }
    
    // 检查上传状态，启用分析按钮
    function checkUploadStatus() {
        if (frontPreview.src && sidePreview.src) {
            analyzeButton.disabled = false;
        } else {
            analyzeButton.disabled = true;
        }
    }
    
    // 模拟分析过程
    analyzeButton.addEventListener('click', function() {
        const progressContainer = document.getElementById('progressContainer');
        const progressFill = document.getElementById('progressFill');
        
        progressContainer.hidden = false;
        analyzeButton.disabled = true;
        
        let progress = 0;
        const interval = setInterval(function() {
            progress += 5;
            progressFill.style.width = progress + '%';
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(function() {
                    document.getElementById('analysisSection').hidden = false;
                    // 显示方案展示与效果模拟部分
                    document.querySelector('.plan-showcase-section').hidden = false;
                    window.scrollTo({
                        top: document.getElementById('analysisSection').offsetTop,
                        behavior: 'smooth'
                    });
                }, 500);
            }
        }, 200);
    });
});
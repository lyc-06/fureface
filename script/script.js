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

    // 年龄模拟radio按钮切换图片
    const ageRadios = document.querySelectorAll('.age-radio');
    const ageImages = document.querySelectorAll('.age-image');

    if (ageRadios.length && ageImages.length) {
        // 初始化显示第一张图片（25岁）
        ageImages[0].classList.add('active');
        
        // 监听radio按钮变化
        ageRadios.forEach((radio, index) => {
            radio.addEventListener('change', function() {
                if (this.checked) {
                    // 移除所有图片的active类
                    ageImages.forEach(img => img.classList.remove('active'));
                    // 为选中的图片添加active类
                    ageImages[index].classList.add('active');
                }
            });
        });
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
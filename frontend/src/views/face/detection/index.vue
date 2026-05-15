<template>
  <div class="detection-container">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="upload-card">
          <template #header>
            <div class="card-header">
              <h3>上传图片</h3>
            </div>
          </template>
          <div class="upload-area">
            <el-upload
              class="image-uploader"
              :show-file-list="false"
              :auto-upload="false"
              :on-change="handleImageChange"
              accept="image/*"
            >
              <template #trigger>
                <el-button type="primary">选择图片</el-button>
              </template>
              <template #default>
                <img v-if="imageUrl" :src="imageUrl" class="preview-image" />
                <el-icon v-else class="upload-icon"><Plus /></el-icon>
              </template>
            </el-upload>
          </div>
          <div class="action-buttons" v-if="imageUrl">
            <el-button type="success" :loading="loading" @click="detectFaces">
              开始检测
            </el-button>
            <el-button @click="resetImage">重置</el-button>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card class="result-card" v-if="detectionResult">
          <template #header>
            <div class="card-header">
              <h3>检测结果</h3>
            </div>
          </template>
          <div class="result-content">
            <div class="result-image-container">
              <img :src="resultImageUrl" class="result-image" />
            </div>
            <div class="result-info">
              <el-descriptions :column="1" border>
                <el-descriptions-item label="检测到的人脸数量">
                  {{ detectionResult.faceCount }}
                </el-descriptions-item>
                <el-descriptions-item label="检测耗时">
                  {{ detectionResult.timeUsed }}ms
                </el-descriptions-item>
              </el-descriptions>
              
              <el-collapse v-if="detectionResult.faces.length">
                <el-collapse-item 
                  v-for="(face, index) in detectionResult.faces" 
                  :key="index"
                  :title="`人脸 #${index + 1}`"
                >
                  <el-descriptions :column="1" border size="small">
                    <el-descriptions-item label="性别">
                      {{ face.gender === 'male' ? '男' : '女' }}
                    </el-descriptions-item>
                    <el-descriptions-item label="年龄">
                      {{ face.age }}
                    </el-descriptions-item>
                    <el-descriptions-item label="表情">
                      {{ face.emotion }}
                    </el-descriptions-item>
                  </el-descriptions>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const imageUrl = ref('')
const resultImageUrl = ref('')
const loading = ref(false)
const detectionResult = ref(null)

import { detectFace } from '@/api/face'

const selectedFile = ref(null)

const handleImageChange = (file) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('只能上传图片文件！')
    return false
  }

  if (file.size / 1024 / 1024 > 5) {
    ElMessage.error('图片大小不能超过 5MB！')
    return false
  }

  selectedFile.value = file.raw
  imageUrl.value = URL.createObjectURL(file.raw)
  detectionResult.value = null
}

const detectFaces = async () => {
  if (!selectedFile.value) {
    ElMessage.warning('请先选择图片')
    return
  }

  loading.value = true
  try {
    const formData = new FormData()
    formData.append('image', selectedFile.value)

    const result = await detectFace(formData)
    
    detectionResult.value = {
      faceCount: result.faceCount,
      timeUsed: result.timeUsed,
      faces: result.faces
    }
    
    // 如果后端返回了处理后的图片，使用后端返回的图片URL
    resultImageUrl.value = result.processedImageUrl || imageUrl.value

    ElMessage.success('检测完成')
  } catch (error) {
    ElMessage.error(error.message || '检测失败')
  } finally {
    loading.value = false
  }
}

const resetImage = () => {
  imageUrl.value = ''
  resultImageUrl.value = ''
  detectionResult.value = null
}
</script>

<style lang="scss" scoped>
.detection-container {
  .upload-card, .result-card {
    height: calc(100vh - 140px);
    display: flex;
    flex-direction: column;

    .card-header {
      h3 {
        margin: 0;
      }
    }

    :deep(.el-card__body) {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }

  .upload-area {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    .image-uploader {
      text-align: center;

      .el-upload {
        border: 1px dashed var(--el-border-color);
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: var(--el-transition-duration);

        &:hover {
          border-color: var(--el-color-primary);
        }
      }

      .upload-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        text-align: center;
        line-height: 178px;
      }
    }

    .preview-image {
      max-width: 100%;
      max-height: 400px;
      object-fit: contain;
    }
  }

  .action-buttons {
    margin-top: 20px;
    text-align: center;
  }

  .result-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow-y: auto;

    .result-image-container {
      text-align: center;

      .result-image {
        max-width: 100%;
        max-height: 300px;
        object-fit: contain;
      }
    }

    .result-info {
      flex: 1;
    }
  }
}
</style>

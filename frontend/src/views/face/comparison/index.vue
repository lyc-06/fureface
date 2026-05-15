<template>
  <div class="comparison-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="upload-card">
          <template #header>
            <div class="card-header">
              <h3>图片 1</h3>
            </div>
          </template>
          <div class="upload-area">
            <el-upload
              class="image-uploader"
              :show-file-list="false"
              :auto-upload="false"
              :on-change="(file) => handleImageChange(file, 1)"
              accept="image/*"
            >
              <template #trigger>
                <el-button type="primary">选择图片</el-button>
              </template>
              <template #default>
                <img v-if="image1Url" :src="image1Url" class="preview-image" />
                <el-icon v-else class="upload-icon"><Plus /></el-icon>
              </template>
            </el-upload>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="upload-card">
          <template #header>
            <div class="card-header">
              <h3>图片 2</h3>
            </div>
          </template>
          <div class="upload-area">
            <el-upload
              class="image-uploader"
              :show-file-list="false"
              :auto-upload="false"
              :on-change="(file) => handleImageChange(file, 2)"
              accept="image/*"
            >
              <template #trigger>
                <el-button type="primary">选择图片</el-button>
              </template>
              <template #default>
                <img v-if="image2Url" :src="image2Url" class="preview-image" />
                <el-icon v-else class="upload-icon"><Plus /></el-icon>
              </template>
            </el-upload>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="result-card">
          <template #header>
            <div class="card-header">
              <h3>比对结果</h3>
            </div>
          </template>
          <div class="result-content">
            <template v-if="comparisonResult">
              <div class="similarity-score">
                <el-progress 
                  type="dashboard"
                  :percentage="comparisonResult.similarity"
                  :color="progressColor"
                >
                  <template #default="{ percentage }">
                    <span class="percentage-value">{{ percentage }}%</span>
                    <span class="percentage-label">相似度</span>
                  </template>
                </el-progress>
              </div>

              <div class="result-details">
                <el-descriptions :column="1" border>
                  <el-descriptions-item label="判定结果">
                    {{ getSimilarityText(comparisonResult.similarity) }}
                  </el-descriptions-item>
                  <el-descriptions-item label="检测耗时">
                    {{ comparisonResult.timeUsed }}ms
                  </el-descriptions-item>
                </el-descriptions>
              </div>
            </template>

            <div v-else class="empty-result">
              <el-empty description="请上传两张图片进行比对" />
              <el-button 
                type="primary"
                @click="compareImages"
                :disabled="!canCompare"
                :loading="loading"
              >
                开始比对
              </el-button>
              <el-button @click="resetImages" v-if="image1Url || image2Url">
                重置
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

import { compareFaces } from '@/api/face'

const image1Url = ref('')
const image2Url = ref('')
const loading = ref(false)
const comparisonResult = ref(null)
const selectedFile1 = ref(null)
const selectedFile2 = ref(null)

const handleImageChange = (file, imageNum) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('只能上传图片文件！')
    return false
  }

  if (file.size / 1024 / 1024 > 5) {
    ElMessage.error('图片大小不能超过 5MB！')
    return false
  }

  if (imageNum === 1) {
    selectedFile1.value = file.raw
    image1Url.value = URL.createObjectURL(file.raw)
  } else {
    selectedFile2.value = file.raw
    image2Url.value = URL.createObjectURL(file.raw)
  }
  comparisonResult.value = null
}

const canCompare = computed(() => {
  return image1Url.value && image2Url.value
})

const progressColor = computed(() => {
  const similarity = comparisonResult.value?.similarity || 0
  if (similarity >= 80) return '#67C23A'
  if (similarity >= 60) return '#E6A23C'
  return '#F56C6C'
})

const getSimilarityText = (similarity) => {
  if (similarity >= 80) return '极可能为同一人'
  if (similarity >= 60) return '可能为同一人'
  return '非同一人'
}

const compareImages = async () => {
  if (!canCompare.value) {
    ElMessage.warning('请先上传两张图片')
    return
  }

  loading.value = true
  try {
    const formData = new FormData()
    formData.append('image1', selectedFile1.value)
    formData.append('image2', selectedFile2.value)

    const result = await compareFaces(formData)
    comparisonResult.value = {
      similarity: result.similarity,
      timeUsed: result.timeUsed
    }

    ElMessage.success('比对完成')
  } catch (error) {
    ElMessage.error(error.message || '比对失败')
  } finally {
    loading.value = false
  }
}

const resetImages = () => {
  image1Url.value = ''
  image2Url.value = ''
  comparisonResult.value = null
}
</script>

<style lang="scss" scoped>
.comparison-container {
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
      max-height: 300px;
      object-fit: contain;
    }
  }

  .result-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 20px;

    .similarity-score {
      text-align: center;

      .percentage-value {
        font-size: 28px;
        font-weight: bold;
        display: block;
      }

      .percentage-label {
        font-size: 14px;
        color: #909399;
      }
    }

    .empty-result {
      text-align: center;

      .el-button {
        margin-top: 20px;
      }
    }
  }
}
</style>

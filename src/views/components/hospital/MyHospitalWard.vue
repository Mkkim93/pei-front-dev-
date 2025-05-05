<script setup lang="ts">
import { ref } from 'vue';
import ArgonButton from '@/components/ArgonButton.vue';
import ArgonInput from '@/components/ArgonInput.vue';
// import { uploadWardExcel } from '@/api/ward'; // 실제 API 경로에 맞게 수정

const file = ref<File | null>(null);
const uploading = ref(false);
const message = ref('');

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const selectedFile = target.files?.[0];
  if (selectedFile) {
    file.value = selectedFile;
    message.value = '';
  }
};

const uploadFile = async () => {
  if (!file.value) {
    message.value = '파일을 선택해주세요.';
    return;
  }

  uploading.value = true;
  const formData = new FormData();
  formData.append('file', file.value);

  try {
    // await uploadWardExcel(formData);
    message.value = '업로드 완료';
    file.value = null;
  } catch (error) {
    console.error(error);
    message.value = '업로드 실패';
  } finally {
    uploading.value = false;
  }
};
</script>

<template>
  <div class="card p-4">
    <h6 class="mb-3">병동 정보 엑셀 업로드</h6>

    <div class="mb-3">
      <label for="wardFile" class="form-label">엑셀 파일 (.xlsx)</label>
      <input
        type="file"
        id="wardFile"
        accept=".xlsx"
        class="form-control"
        @change="handleFileChange"
      />
    </div>

    <div class="d-flex justify-content-end">
      <argon-button color="primary" @click="uploadFile" :disabled="uploading">
        {{ uploading ? '업로드 중...' : '업로드' }}
      </argon-button>
    </div>

    <p class="mt-3 text-sm text-success" v-if="message">{{ message }}</p>
  </div>
</template>

<style scoped>
input[type='file'] {
  padding: 0.5rem;
  font-size: 0.875rem;
}
</style>

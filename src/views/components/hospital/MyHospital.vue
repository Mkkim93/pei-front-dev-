<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { fetchHospitalData } from '@/api/hospital';
import { HospitalListType } from '@/types/hospital';
const hospitalData = reactive<HospitalListType>({
  id: 0,
  name: '',
  description: '',
  imgUrl: '',
});

import ArgonInput from '@/components/ArgonInput.vue';
import ArgonButton from '@/components/ArgonButton.vue';

onMounted( async () => {
  // TODO
  const response = await fetchHospitalData();
  console.log('my hos response: ', response);
  Object.assign(hospitalData, response.data);
})
</script>

<template>
  <div class="container-flud">
  <div class="row">
        <div class="col-12 col-lg-12mx-auto">
          <div class="card">
            <div class="card-header pb-0">
              <div class="d-flex align-items-center">
                <h6 class="mb-0">내 병원 수정</h6>
                <argon-button color="success" size="sm" class="ms-auto">수정</argon-button>
              </div>
            </div>
            <div class="card-body">
              <p class="text-uppercase text-sm">병원 정보</p>
             <div class="row">
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label">병원명</label>
                  {{ hospitalData.name }}
                </div>
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label">이메일</label>
                  {{ hospitalData.description }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
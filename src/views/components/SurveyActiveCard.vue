<script setup lang="ts">
import { ref, onMounted } from "vue";
import { fetchSurveyTypeStatusPage } from '@/api/survey-type';
import { ApiPageResponse } from '@/types/api';
import { SurveyTypeStatusList } from '@/types/survey-type';
import { formatDate } from "@/utils/date";
const surveyTypeStatusData = ref<SurveyTypeStatusList[]>();

onMounted(async () => {
    const response = await fetchSurveyTypeStatusPage(0, 3, false, 'ACTIVE');
    console.log('status res: ', response.data.content);
    surveyTypeStatusData.value = response.data.content;
})
</script>

<template>
    <div class="card mt-4">
        <div class="card-header pb-4 p-3">
            <div class="row">
                <div class="col-6 d-flex align-items-center">
                    <h6 class="mb-3">진행 중인 설문</h6>
                </div>
            </div>
        </div>
        <div class="card-body p-3">
            <div class="table-responsive">
                <table class="table table-hover align-items-center mb-0">
                    <thead>
                        <tr>
                            <th scope="col">설문명</th>
                            <th scope="col">작성일</th>
                            <th scope="col" class="text-center">유형</th>
                            <th scope="col" class="text-center">설문 시작일</th>
                            <th scope="col" class="text-center">설문 종료일</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="status in surveyTypeStatusData" :key="status.id">
                            <td>{{ status.title || '-' }}</td>
                            <td>{{ status.createdAt ? formatDate(status.createdAt) : '-' }}</td>
                            <td>{{ status.name }}</td>
                            <td class="text-center">{{ formatDate(status.openAt) }}</td>
                            <td class="text-center">{{ formatDate(status.closeAt) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    </div>
</template>

<style scoped>
.table th {
    font-weight: 600;
}

.table td,
.table th {
    vertical-align: middle;
}
</style>
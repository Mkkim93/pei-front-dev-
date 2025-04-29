<script setup lang="ts">
import { onMounted, ref } from "vue";
import ArgonButton from "@/components/ArgonButton.vue";
import { fetchHospitalList } from "@/api/hospital";
import { HospitalListType } from "@/types/hospital";
import { PageResponse } from "@/types/page";
import { ApiPageResponse } from "@/types/api";
const hospitalList = ref<HospitalListType[]>();
const pageData = ref<PageResponse>();

onMounted(async () => {
  const response = await fetchHospitalList(0, 5);
  hospitalList.value = response.data.content;
  pageData.value = response.data.page;
})

</script>
<template>
  <div class="card pb-4">
    <div class="card-header pb-0 p-3">
      <div class="row">
        <div class="col-6 d-flex align-items-center">
          <h6 class="mb-0">병원 목록</h6>
        </div>
        <div class="col-6 text-end">
          <argon-button color="success" size="sm" variant="outline"
            >더보기</argon-button
          >
        </div>
      </div>
    </div>

    <!-- api -->
    <div class="card-body p-3 pb-0 mb-0">
      <ul class="list-group">
        <li v-for="hospital in hospitalList" :key="hospital.id"
          class="list-group-item border-0 d-flex justify-content-between ps-0 mb-2 border-radius-lg"
        >
          <div class="d-flex flex-column">
            <h6 class="mb-1 text-dark font-weight-bold text-sm">
              March, 01, 2020
            </h6>
            <span class="text-xs">{{ hospital.name }}</span>
          </div>
          <div class="d-flex align-items-center text-sm">
            $180
            <button class="btn btn-link text-dark text-sm mb-0 px-0 ms-4">
              <i class="fas fa-file-pdf text-lg me-1" aria-hidden="true"></i>
              PDF
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

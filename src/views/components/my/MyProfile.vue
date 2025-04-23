<script setup lang="ts">
import { onMounted, reactive } from "vue";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import { fetchUsersProfile } from "@/api/users";
import { UsersType } from "@/types/users.d";
import ProfileCard from "../ProfileCard.vue";

const profile = reactive<UsersType>({
  username: '',
  name: '',
  phone: '',
  mail: '',
  roleType: ''
});

onMounted(async () => {
  const response = await fetchUsersProfile();
  console.log('response: ', response);
  Object.assign(profile, response.data); // reactive 객체 업데이트
  console.log('profile: ', profile);
});
</script>

<template>
    <div class="row">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header pb-0">
              <div class="d-flex align-items-center">
                <h6 class="mb-0">내 정보 수정</h6>
                <argon-button color="success" size="sm" class="ms-auto">수정</argon-button>
              </div>
            </div>
            <div class="card-body">
              <p class="text-uppercase text-sm">나의 정보</p>
              <div class="row">
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label">아이디</label>
                  <argon-input type="text" v-model="profile.username" disabled />
                </div>
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label">이메일</label>
                  <argon-input type="email" value="jesse@example.com" v-model="profile.mail" />
                </div>
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label">이름</label>
                  <input class="form-control" type="text" v-model="profile.name" />
                </div>
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label">연락처</label>
                  <argon-input type="text" value="Lucky" v-model="profile.phone" />
                </div>
              </div>
              <hr class="horizontal dark" />
              <p class="text-uppercase text-sm">상세 정보</p>
              <div class="row">
                <div class="col-md-12">
                  <label for="example-text-input" class="form-control-label">주소</label>
                  <argon-input type="text" value="Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09" />
                </div>
                <div class="col-md-4">
                  <label for="example-text-input" class="form-control-label">지역</label>
                  <argon-input type="text" value="New York" />
                </div>
                <div class="col-md-4">
                  <label for="example-text-input" class="form-control-label">소속</label>
                  <argon-input type="text" value="United States" />
                </div>
                <div class="col-md-4">
                  <label for="example-text-input" class="form-control-label">우편 번호</label>
                  <argon-input type="text" value="437300" />
                </div>
              </div>
              <hr class="horizontal dark" />
              <p class="text-uppercase text-sm">소개</p>
              <div class="row">
                <div class="col-md-12">
                  <label for="example-text-input" class="form-control-label">인사말</label>
                  <argon-input type="text" value="A beautiful Dashboard for Bootstrap 5. It is Free and Open Source." />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <profile-card />
        </div>
      </div>
</template>

<style scoped>

</style>
<script setup lang="ts">
import { onBeforeMount, onMounted, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import setNavPills from "@/assets/js/nav-pills.js";
import setTooltip from "@/assets/js/tooltip.js";

const body = document.getElementsByTagName("body")[0];
const store = useStore();

onMounted(() => {
  store.state.isAbsolute = true;
  setNavPills();
  setTooltip();
});

onBeforeMount(() => {
  store.state.imageLayout = "profile-overview";
  store.state.showNavbar = false;
  store.state.showFooter = true;
  store.state.hideConfigButton = true;
  body.classList.add("profile-overview");
});

onBeforeUnmount(() => {
  store.state.isAbsolute = false;
  store.state.imageLayout = "default";
  store.state.showNavbar = true;
  store.state.showFooter = true;
  store.state.hideConfigButton = false;
  body.classList.remove("profile-overview");
});
</script>

<template>
  <main>
    <div class="container-fluid">
      <div class="page-header min-height-300" style="
          background-image: url(&quot;https://images.unsplash.com/photo-1587351021355-a479a299d2f9?q=80&w=3544&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D;);
          margin-right: -24px;
          margin-left: -34%;
        ">
        <span class="mask bg-gradient-info opacity-6"></span>
      </div>
      <div class="card shadow-lg mt-n6">
        <div class="card-body p-3">
          <div class="row gx-4">
            <div class="col-auto">
              <div class="avatar avatar-xl position-relative">
                <img src="../assets/img/team-1.jpg" alt="profile_image" class="shadow-sm w-100 border-radius-lg" />
              </div>
            </div>
            <div class="col-auto my-auto">
              <div class="h-100">

                <!-- <h5 class="mb-1">{{ profile.name }}</h5>
                <p class="mb-0 font-weight-bold text-sm"> {{ profile.roleType }}</p> -->
              </div>
            </div>
            <div class="mx-auto mt-3 col-lg-4 col-md-6 my-sm-auto ms-sm-auto me-sm-0">
              <div class="nav-wrapper position-relative end-0">
                <ul class="p-1 bg-transparent nav nav-pills nav-fill" role="tablist">
                  <li class="nav-item">
                    <router-link class="px-0 py-1 mb-0 nav-link active" active-class="active"
                      :to="{ name: 'MyProfile' }">
                      <font-awesome-icon :icon="['fas', 'circle-user']" />
                      <span class="ms-1">정보</span>
                    </router-link>
                  </li>

                  <li class="nav-item">
                    <router-link class="px-0 py-1 mb-0 nav-link active" active-class="active"
                      :to="{ name: 'MyActivity' }" role="tab" aria-selected="true">
                      <font-awesome-icon :icon="['fas', 'dice-d6']" />
                      <span class="ms-1">진료과</span>
                    </router-link>
                  </li>

                  <li class="nav-item">
                    <router-link class="px-0 py-1 mb-0 nav-link active" active-class="active" :to="{ name: 'MyNotify' }"
                      role="tab" aria-selected="false">
                      <font-awesome-icon :icon="['fas', 'bell']" />
                      <span class="ms-1">병동</span>
                    </router-link>
                  </li>
                  <li class="nav-item">
                    <router-link class="px-0 py-1 mb-0 nav-link active" active-class="active"
                      :to="{ name: 'UserManager' }" role="tab" aria-selected="false">
                      <font-awesome-icon :icon="['fas', 'users-gear']" />
                      <span class="ms-1">관리</span>
                    </router-link>
                  </li>
                  <li class="nav-item">
                    <router-link class="px-0 py-1 mb-0 nav-link active" active-class="active"
                      :to="{ name: 'MySetting' }" role="tab" aria-selected="false">
                      <font-awesome-icon :icon="['fas', 'gear']" />
                      <span class="ms-1">설정</span>
                    </router-link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="py-4 container-fluid">
    <router-view />
    </div>
  </main>
</template>

<style scoped>

</style>
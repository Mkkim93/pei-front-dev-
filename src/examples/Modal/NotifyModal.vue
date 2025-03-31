<template>
    <div class="notification-panel">
    <h3>🔔 알림</h3>
    <ul>
      <li v-for="item in notifications" :key="item.id">
        <span>{{ item.message }}</span>
        <button @click="markRead(item.id)">읽음</button>
      </li>
    </ul>
    <div v-if="unreadCount === 0">📭 알림 없음</div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import { useToast } from 'vue-toastification';

export default {
    data() {
    return {
      toast: useToast(),
      shownIds: [] // 이미 띄운 알림 추적용
    }
  },
    computed: {
        ...mapGetters("notify", ["notifications", "unreadCount"])
        
    },

    methods: {
        ...mapActions("notify", ["markAsRead"]),

        markAsRead(id) {
            this.markAsRead(id);
        }
    },

    watch: {
    notifications: {
      immediate: true,
      deep: true,
      handler(newList) {
        newList.forEach((item) => {
          if (!this.shownIds.includes(item.id)) {
            this.toast(item.message, { id: item.id })
            this.shownIds.push(item.id)
          }
        })
      }
    }
  },
}
</script>
<style scoped>
.notification-panel {
  padding: 1rem;
  background-color: #f7f7f7;
  border-radius: 8px;
}
</style>
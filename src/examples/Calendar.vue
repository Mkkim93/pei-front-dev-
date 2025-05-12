<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { ScheduleListType, ScheduleUpdateDTO } from "@/types/schedule";
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from "@fullcalendar/daygrid";
import { fetchScheduleList, deleteSchedule, updateSchedule } from "@/api/schedule";
import { formatToday, toLocalDateTimeStringFromString } from "@/utils/date";
import ArgonButton from "@/components/ArgonButton.vue";
import ArgonInput from "@/components/ArgonInput.vue";
const events = ref<any[]>([]);
const showDetail = ref(false);
const showEditModal = ref(false);
const selectedEvent = ref<any>(null);
const tooltipStyle = ref({ top: '50px', left: '50px' });
const calendarRef = ref();

const editData = ref<ScheduleUpdateDTO>({
  id: 0,
  title: '',
  description: '',
  updatedAt: '',
  startTime: '',
  endTime: '',
  isDeleted: false,
});
defineExpose({ calendarRef });

const emit = defineEmits(['add-schedule', 'edit-schedule']);
const calendarOptions = ref({
  contentHeight: 'auto',
  plugins: [dayGridPlugin],
  initialView: 'dayGridMonth',
  selectable: true,
  editable: true,
  events,
  initialDate: formatToday(),
  headerToolbar: {
    start: "title",
    center: "",
    end: "today prev,next",
  },
  dateClick: (info: any) => emit('add-schedule', info),
  eventClick: (info: any) => {
    selectedEvent.value = info.event;
    showDetail.value = true;

    // 위치 계산 (기본)
    const rect = info.el.getBoundingClientRect();
    tooltipStyle.value = {
      top: `${rect.bottom + window.scrollY}px`,
      left: `${rect.left + window.scrollX}px`,
    };
  },
});

const editView = () => {
  const event = selectedEvent.value;
  editData.value = {
    id: event.id,
    title: event.title,
    description: event.extendedProps?.descripton || '',
    updatedAt: new Date(),
    startTime: toLocalDateTimeStringFromString(event.start),
    endTime: toLocalDateTimeStringFromString(event.end),
    isDeleted: false,
  };

  showDetail.value = false;
  showEditModal.value = true;
};

const editPost = async () => {
  console.log('수정할 객체: ', editData.value);

  try {
    const updated = editData.value;
   
   
    
    const calenderApi = calendarRef.value.getApi();
    const event = calenderApi.getEventById(updated.id);
    const response = await updateSchedule(editData.value);
    console.log('respone: ', response.message);
    if (event) {
      // ✅ 화면에 즉시 반영
    event.setProp('title', updated.title);
    event.setStart(new Date(updated.startTime));
    event.setEnd(new Date(updated.endTime));
    event.setExtendedProp('descripton', updated.description);
    }
    alert(response.message);
    showEditModal.value = false;
  } catch (error) {
    console.error(error);
  }
}

const deleteEvent = async () => {
  console.log('삭제할 id', selectedEvent.value.id);
  const deletedId = selectedEvent.value.id;

  try {
    const response = await deleteSchedule(deletedId);
    console.log('삭제후 response: ', response);

    const calenderApi = calendarRef.value.getApi();
    const event = calenderApi.getEventById(deletedId);
    if (event) {
      event.remove();
    }
    alert(response.message);
    showDetail.value = false;
  } catch (error) {
    console.error('삭제 실패: ', error);
  }
}

onMounted(async () => {
  const response = await fetchScheduleList();
  if (response.data) {
    events.value = response.data.map((item: ScheduleListType) => ({
      id: item.id,
      title: item.title,
      start: item.startTime,
      end: item.endTime,
      descripton: item.description,
      status: item.status,
      className: "bg-gradient-success",
    }));
  }
});
</script>
<template>
  <div class="card widget-calendar">
    <div class="p-3 card-body">
      <FullCalendar ref="calendarRef" :options="calendarOptions" />
    </div>
  </div>

  <div v-if="showDetail" class="tooltip-modal" :style="tooltipStyle">
    <h4>{{ selectedEvent.title }}</h4>
    <p>{{ selectedEvent.start }} ~ {{ selectedEvent.end }}</p>
    <p><i class="fa fa-map-marker"></i> {{ selectedEvent.extendedProps?.descripton }}</p>
    <p><i class="fa fa-user"></i> {{ selectedEvent.extendedProps?.status }}</p>
    <div class="actions">
      <ArgonButton color="Info" @click="editView">✏️ Edit</ArgonButton>
      <ArgonButton color="Secondary" @click="deleteEvent">🗑️ Delete</ArgonButton>
    </div>
  </div>
  <!-- 배경 클릭 시 모달 닫기 -->
  <div v-if="showDetail" class="modal-backdrop" @click="showDetail = false" />

  <div v-if="showEditModal" class="tooltip-modal" :style="tooltipStyle">
  <ArgonInput type="text" v-model="editData.title" />
  <ArgonInput type="date" v-model="editData.startTime" />
  <ArgonInput type="date" v-model="editData.endTime" />
  <ArgonInput type="text" v-model="editData.description" />
  <ArgonButton @click="editPost">수정</ArgonButton>
</div>
  <div v-if="showEditModal" class="modal-backdrop" @click="showEditModal = false" />
</template>
<style scoped>
.tooltip-modal {
  position: fixed;
  z-index: 1001;
  /* 높게 */
  background: white;
  border-top: 1rem solid #95688f;
  border-radius: 8px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
  padding: 1rem;
  min-width: 120px;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  /* 반투명 검정 */
  z-index: 1000;
  /* 낮게 */
}
</style>

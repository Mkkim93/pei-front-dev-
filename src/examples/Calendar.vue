<script setup lang="ts">
import { onMounted, ref, reactive } from "vue";
import { ScheduleListType, ScheduleUpdateDTO, ScheduleCreateDTO, SchduleResponseDTO } from "@/types/schedule";
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from "@fullcalendar/daygrid";
import { fetchScheduleList, deleteSchedule, updateSchedule, createSchedule } from "@/api/schedule";
import { formatToday, toLocalDateTimeStringFromString, toLocalDateTimeString } from "@/utils/date";
import ArgonButton from "@/components/ArgonButton.vue";
import ArgonInput from "@/components/ArgonInput.vue";
const events = ref<any[]>([]);
const showPostModal = ref(false);
const showDetail = ref(false);
const showEditModal = ref(false);
const selectedEvent = ref<any>(null);
const tooltipStyle = ref({ top: '50px', left: '50px' });
const calendarRef = ref();

const postTitle = ref<string>('');
const postDescription = ref<string>('');
const postStartTime = ref<string | Date>('');
const postEndTime = ref<string | Date>('');

const editData = ref<ScheduleUpdateDTO>({
  id: 0,
  title: '',
  description: '',
  updatedAt: '',
  startTime: '',
  endTime: '',
  isDeleted: false,
});

const postData = ref<ScheduleCreateDTO>({
  title: '',
  description: '',
  startTime: '',
  endTime: '',
})

const responseData = ref<SchduleResponseDTO>({
  id: 0,
  title: '',
  description: '',
  startTime: '',
  endTime: '',
})

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

const postView = async () => {
  showPostModal.value = true;
}

const postSchedule = async () => {
  try {
    postData.value = {
      title: postTitle.value,
      description: postDescription.value,
      startTime: new Date(postStartTime.value),
      endTime: new Date(postEndTime.value),
    }

    const response = await createSchedule(postData.value);
    console.log('respone:', response);
    if (response.data) {
      responseData.value.id = Number(response.data.id);
      responseData.value.title = response.data.title;
      responseData.value.description = response.data.description;
      responseData.value.startTime = response.data.startTime;
      responseData.value.endTime = response.data.endTime;
      console.log('저장 후 받환받은 responseDTO: ', responseData);
      const calenderApi = calendarRef.value.getApi();

       calenderApi.addEvent({
        id: response.data.id,
        title: response.data.title,
        start: response.data.startTime,
        end: response.data.endTime,
        extendedProps: {
          description: response.data.description,
        },
        className: 'bg-gradient-success',
      });
    }
    // alert(response.message);
    showPostModal.value = false;
  } catch (error) {
    console.error(error);
  }
}

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
      <ArgonButton @click="postView">+</ArgonButton>
      <FullCalendar ref="calendarRef" :options="calendarOptions" />
    </div>
  </div>

  <!-- 일정 상세 모달 -->
  <div v-if="showDetail" class="tooltip-modal">
    <h4>{{ selectedEvent.title }}</h4>
    <p>{{ toLocalDateTimeString(selectedEvent.start) }} ~ {{ toLocalDateTimeString(selectedEvent.end) }}</p>
    <p><i class="fa fa-map-marker"></i> {{ selectedEvent.extendedProps?.descripton }}</p>
    <p><i class="fa fa-user"></i> {{ selectedEvent.extendedProps?.status }}</p>
    <div class="actions">
      <ArgonButton color="Info" @click="editView">✏️ Edit</ArgonButton>
      <ArgonButton color="Secondary" @click="deleteEvent">🗑️ Delete</ArgonButton>
    </div>
  </div>

  <div v-if="showDetail" class="modal-backdrop" @click="showDetail = false" />

  <!-- 일정 수정 모달 -->
  <div v-if="showEditModal" class="tooltip-modal">
    <ArgonInput type="text" v-model="editData.title" />
    <ArgonInput type="date" v-model="editData.startTime" />
    <ArgonInput type="date" v-model="editData.endTime" />
    <ArgonInput type="text" v-model="editData.description" />
    <ArgonButton @click="editPost">수정</ArgonButton>
  </div>
  <div v-if="showEditModal" class="modal-backdrop" @click="showEditModal = false" />

  <!-- 일정 추가 모달 -->
  <div v-if="showPostModal" class="tooltip-modal">
    <h4>일정 추가</h4>
    <label for="title">
      <ArgonInput type="text" v-model="postTitle" placeholder="제목" />
    </label>
    <label for="startTime">
      <ArgonInput type="date" v-model="postStartTime" placeholder="시작일" />
    </label>
    <label for="endTime">
      <ArgonInput type="date" v-model="postEndTime" placeholder="종료일" />
    </label>
    <label for="description">
      <ArgonInput type="text" v-model="postDescription" placeholder="설명" />
    </label>
    <div class="actions">
      <ArgonButton color="Primary" @click="postSchedule">저장</ArgonButton>
      <ArgonButton color="Secondary" @click="showPostModal = false">취소</ArgonButton>
    </div>
  </div>
  <div v-if="showPostModal" class="modal-backdrop" @click="showPostModal = false" />

</template>
<style scoped>
.tooltip-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* 화면 정중앙 정렬 */
  z-index: 1001;
  background: white;
  border-top: 1rem solid #95688f;
  border-radius: 8px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
  padding: 1rem;
  min-width: 300px;
  max-width: 90%;
}


.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1000;
}
</style>

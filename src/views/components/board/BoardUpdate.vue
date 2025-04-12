<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { BoardDetailType, BoardUpdateType } from '@/types/board';
import { formatDateDetail } from '@/utils/date';
import { fetchBoardDetail, patchBoardContent } from '@/api/board';
import ArgonInput from '@/components/ArgonInput.vue';
import ArgonButton from '@/components/ArgonButton.vue';
import EditorManagerment from '@/examples/editor/EditorManagerment.vue';
import router from '@/router';

const route = useRoute();
const emit = defineEmits(['update:modelValue']);

const boardContent = reactive<BoardDetailType>({
    id: 0,
    title: '',
    content: '',
    updatedAt: '',
    writer: '',
    views: 0,
});

onMounted(async () => {
    const boardId = Number(route.params.id);
    const response = await fetchBoardDetail(boardId);
    Object.assign(boardContent, response.data);
})

const patchContent = async () => {
    const updateObj: BoardUpdateType = ({
        id: boardContent.id,
        title: boardContent.title,
        content: boardContent.content,
    })
    try {
        const response = await patchBoardContent(updateObj);
        alert(response.message);
        router.push(`/detail/${response.data}`);
    } catch (error) {
        console.log('게시글 업데이트 실패: ', error);
    }
}
</script>
<template>
    <div class="container">
    <div class="card mt-6 px-4 custom-card">
        <div class="card-header pb-4 d-flex justify-content-between align-items-center">
            <h6>게시글 수정</h6>
            <div class="d-flex gap-2 ms-auto">
                <ArgonButton color="primary" @click="patchContent">수정</ArgonButton>
                <router-link :to="`/detail/${boardContent.id}`">
                    <ArgonButton color="secondary">취소</ArgonButton>
                </router-link>
            </div>
        </div>
        <div class="card-body px-4 pt-2 pb-2">
            <div class="table-responsive p-0" style="overflow: visible;">
                <div class="p-4">
                    <div class="col-md-3">
                        <span class="bbs-label">작성자:</span>
                        <span class="bbs-value"> {{ boardContent.writer }} </span>
                    </div>
                    <div class="col-md-3">
                    <span class="bbs-label">작성일:</span>
                    <span class="bbs-value"> {{ formatDateDetail(boardContent.updatedAt) }} </span>
                </div>
                    <span class="bbs-label">제목</span>
                    <ArgonInput type="text" placeholder="제목을 입력해주세요" class="mb-3" v-model="boardContent.title" />
                </div>
                <EditorManagerment v-model="boardContent.content" />
            </div>
        </div>
    </div>
    </div>
</template>

<style scoped>
.custom-card {
    min-height: 80vh;
}
</style>
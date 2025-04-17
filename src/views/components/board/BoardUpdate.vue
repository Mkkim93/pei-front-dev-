<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { BoardDetailType, BoardUpdateType, BoardDetailFileType } from '@/types/board';
import { formatDateDetail } from '@/utils/date';
import { fetchBoardDetail, patchBoardContent, downloadFile } from '@/api/board';
import ArgonInput from '@/components/ArgonInput.vue';
import ArgonButton from '@/components/ArgonButton.vue';
import ArgonCheckbox from '@/components/ArgonCheckbox.vue';
import EditorManager from '@/examples/editor/EditorManager.vue';
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
    boardFiles: [],
});
const boardFileContent = ref<BoardDetailFileType[]>([]);

onMounted(async () => {
    const boardId = Number(route.params.id);
    const response = await fetchBoardDetail(boardId);
    Object.assign(boardContent, response.data);
    boardFileContent.value = boardContent.boardFiles;
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

// TODO 나중에 리펙토링
const download = async (id: number, name: string) => {
    try {
        await downloadFile(id, name);
    } catch (error) {
        console.log('error: ', error);
    }
}
</script>
<template>
    <div class="container-flud">
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

                    <div class="col-md-4 text-md-end">
                        <div v-for="f in boardFileContent" :key="f.id">
                            <div v-if="f.renderType === 'LIST'">
                                <ArgonCheckbox></ArgonCheckbox>
                                <span>{{ f.orgName }}</span>
                                <argon-button @click="download(f.id, f.name)">다운로드</argon-button>
                            </div>
                        </div>
                    </div>
                    <EditorManager v-model="boardContent.content" />
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
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { BoardDetailType, BoardUpdateType, BoardFileListType } from '@/types/board';
import { formatDateDetail } from '@/utils/date';
import { fetchBoardDetail, patchBoardContent, downloadFile } from '@/api/board';
import ArgonInput from '@/components/ArgonInput.vue';
import ArgonButton from '@/components/ArgonButton.vue';
import EditorManager from '@/examples/editor/EditorManager.vue';
import router from '@/router';

const route = useRoute();
const boardContent = reactive<BoardDetailType>({
    id: 0,
    title: '',
    content: '',
    updatedAt: '',
    writer: '',
    views: 0,
    usersId: 0,
    boardFiles: [],
});
const boardFileContent = ref<BoardFileListType[]>([]);

onMounted(async () => {
    const boardId = Number(route.params.id);
    const response = await fetchBoardDetail(boardId);
    Object.assign(boardContent, response.data);
    boardFileContent.value = boardContent.boardFiles;
    const inlineImages = boardFileContent.value.filter(f => f.renderType === 'INLINE');
    inlineImages.forEach(file => file.used = true); // 혹시 false 상태일 경우 대비
})

// 삭제할 파일 id 를 게시글이 최종 수정되기 전까지 기록
const removeStore = async (id: number) => {
    console.log('delete id: ', id);
    console.log('boardFileContent: ', boardFileContent.value);
    boardFileContent.value.forEach((item) => {
        console.log('updateFiles: ', boardFileContent.value);
        if (item.id == id) {
            item.used = false;
        }
    });
}

const newFileUpdate = async (files: BoardFileListType[]) => {
    // 1. 새로운 파일만 필터링 (id가 없는 신규 파일로 판단)
    const newFiles = files.filter(f => !('id' in f) || f.id === undefined);
    // 2. 기존 파일 목록 유지하면서 새로운 파일 추가
    boardFileContent.value = [
        ...boardFileContent.value,
        ...(newFiles.map(file => ({
            ...file
        })) as BoardFileListType[])
    ];
}

const patchContent = async () => {
    const updateObj: BoardUpdateType = ({
        id: boardContent.id,
        title: boardContent.title,
        content: boardContent.content,
        boardFiles: boardFileContent.value,
    })
    try {
        const response = await patchBoardContent(updateObj);
        alert(response.message);
        router.push(`/detail/${response.data}`);
    } catch (error) {
        console.log('게시글 업데이트 실패: ', error);
    }
}

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
                            <div v-if="f.renderType === 'LIST' && f.used === true">
                                <argon-button size="sm" variant="outline" @click="removeStore(f.id)">x</argon-button>
                                <span>{{ f.orgName }}</span>
                                <argon-button size="sm" @click="download(f.id, f.name)">다운로드</argon-button>
                            </div>
                        </div>
                    </div>
                    <EditorManager v-model="boardContent.content" @update:boardFiles="newFileUpdate" />
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
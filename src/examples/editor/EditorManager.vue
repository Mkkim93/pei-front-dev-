<script setup lang="ts">
import { ref, onBeforeUnmount, computed, watch, onMounted } from 'vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import { BoardFileListType } from '@/types/board'
import { s3upload } from '@/api/s3api';
import { Color } from '@tiptap/extension-color'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import ListItem from '@tiptap/extension-list-item'
import FontFamily from '@tiptap/extension-font-family'
import ListKeymap from '@tiptap/extension-list-keymap'

import ImageResize from 'tiptap-extension-resize-image';

const editor = ref<Editor | any>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const showUploadMenu = ref(false);

const imageInput = ref<HTMLInputElement | null>(null);
const uploadedFiles = ref<BoardFileListType[]>([]);

onMounted(() => {
  if (props.boardFiles && props.boardFiles.length > 0) {
    // INLINE 이미지만 uploadedFiles에 등록
    uploadedFiles.value = props.boardFiles.filter(f => f.renderType === 'INLINE')
  }
})

const openUploadMenu = () => {
  showUploadMenu.value = !showUploadMenu.value
}

const handleImageUpload = () => {
  imageInput.value?.click()
}

const handleFileUpload = () => {
  fileInput.value?.click()
}

onBeforeUnmount(() => {
  editor.value.destroy()
})

const color = ref('#000000');
const showColorPicker = ref(false);

// 부모 컴포넌트에서 받은 값
const props = defineProps<{
  modelValue: string
  boardFiles?: BoardFileListType[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'update:boardFiles', files: BoardFileListType[]): void
}>();

editor.value?.on('update', () => {
  emit('update:modelValue', editor.value!.getHTML())
})

watch(() => props.modelValue, (newVal) => {
  if (editor.value && editor.value.getHTML() !== newVal) {
    editor.value.commands.setContent(newVal, false)
  }
},
  { immediate: true }
)

const hasActiveMarks = computed(() =>
  editor.value.isActive('bold') ||
  editor.value.isActive('italic') ||
  editor.value.isActive('underline') ||
  editor.value.isActive('strike')
)

editor.value = new Editor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    ImageResize,
    ListKeymap,
    TextStyle.configure({ mergeNestedSpanStyles: true }),
    FontFamily,
    Underline,
    Highlight,
    Link,
    Placeholder.configure({
      placeholder: '내용을 입력하주세요.'
    }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
  ],
  onUpdate: ({ editor }) => {
  emit('update:modelValue', editor.getHTML());

  const parser = new DOMParser();
  const doc = parser.parseFromString(editor.getHTML(), 'text/html');
  const currentImageSrcs: string[] = Array.from(doc.querySelectorAll('img'))
    .map(img => img.getAttribute('src'))
    .filter((src): src is string => src !== null);

  let changed = false;

  uploadedFiles.value.forEach((file) => {
    if (file.renderType === 'INLINE') {
      const shouldBeUsed = currentImageSrcs.includes(file.path);
      if (file.used !== shouldBeUsed) {
        file.used = shouldBeUsed;
        changed = true;
      }
    }
  });

  if (changed) {
    emit('update:boardFiles', uploadedFiles.value);
    
  }
}
})

const imgUpload = async (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (!files || files.length === 0) return
  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file);
  }

  const response = await s3upload(formData);
  const dataList = response.data;
  const imgUrls: string[] = [];

  dataList.forEach((data: BoardFileListType) => {
    imgUrls.push(data.path);
  });

  const imagesHtml = imgUrls
    .map(url => `<img src="${url}" style="max-width:100%; height=auto"/><p></p>`)
    .join('');

  editor.value.chain().focus().insertContent(imagesHtml).run();

  for (const data of dataList) {
    uploadedFiles.value.push({
      id: data.id,
      name: data.name,
      path: data.path,
      orgName: data.orgName,
      type: data.type,
      size: data.size,
      renderType: "INLINE",
      used: true,
    })
  }
  emit('update:boardFiles', uploadedFiles.value);
}

const fileUpload = async (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (!files || files.length === 0) return
  const formData = new FormData();
  for (const file of files) {
    formData.append("files", file);
  }

  const response = await s3upload(formData);
  const dataList = response.data;

  dataList.forEach((data: BoardFileListType) => {
    uploadedFiles.value.push({
      id: data.id,
      name: data.name,
      path: data.path,
      orgName: data.orgName,
      type: data.type,
      size: data.size,
      renderType: "LIST",
      used: true,
    });
  })

  // TODO 서버에 LIST, INLINE 으로 각각 저장 했고 이제 게시글 상세 랜더링 시 각각의 타입에 맞게 랜더링
  emit('update:boardFiles', uploadedFiles.value);
}

const setColorFromPalette = (selectedColor: string) => {
  color.value = selectedColor
  editor.value.chain().focus().setColor(selectedColor).run()
  showColorPicker.value = false
}

const colors = [
  '#000000', '#FF0000', '#FFA500', '#FFFF00',
  '#008000', '#0000FF', '#800080', '#FFFFFF', '#958DF1'
]

</script>

<template>
  <div class="editor-toolbar mb-3">
    <div class="upload-dropdown">
      <button type="button" class="icon-btn material-symbols-outlined" @click="openUploadMenu">
        add_photo_alternate
      </button>

      <!-- 드롭다운 메뉴 -->
      <div v-if="showUploadMenu" class="upload-menu">
        <div class="upload-menu-item" @click="handleImageUpload">
          📷 사진
        </div>
        <div class="upload-menu-item" @click="handleFileUpload">
          📁 파일
        </div>
      </div>
      <!-- 숨겨진 인풋 -->
      <input ref="imageInput" type="file" multiple accept="image/*" @change="imgUpload" style="display: none;" />
      <input ref="fileInput" type="file" multiple @change="fileUpload" style="display: none;" />
    </div>

    <button class="icon-btn" @click="editor.chain().focus().undo().run()"
      :disabled="!editor.can().chain().focus().undo().run()">
      undo
    </button>
    <button class="icon-btn" @click="editor.chain().focus().redo().run()"
      :disabled="!editor.can().chain().focus().redo().run()">
      redo
    </button>

    <p class="bar">|</p>

    <button class="icon-btn" :disabled="!editor.can().chain().focus().toggleBold().run()"
      :class="{ active: editor.isActive('bold') }" @click="editor.chain().focus().toggleBold().run()">
      format_bold
    </button>

    <button class="icon-btn" :disabled="!editor.can().chain().focus().toggleItalic().run()"
      :class="{ active: editor.isActive('italic') }" @click="editor.chain().focus().toggleItalic().run()">
      format_italic
    </button>

    <button class="icon-btn" @click="editor.chain().focus().toggleUnderline().run()"
      :class="{ 'is-active': editor.isActive('underline') }">
      format_underlined
    </button>

    <!-- 취소선 -->
    <button class="icon-btn" @click="editor.chain().focus().toggleStrike().run()"
      :disabled="!editor.can().chain().focus().toggleStrike().run()"
      :class="{ 'is-active': editor.isActive('strike') }">
      format_strikethrough
    </button>

    <button class="icon-btn" :disabled="!editor.can().chain().focus().toggleStrike().run()"
      :class="{ active: hasActiveMarks }" @click="editor.chain().focus().unsetAllMarks().run()">
      clear_all
    </button>

    <div style="position: relative; display: inline-block;">
      <button class="icon-btn" @click="showColorPicker = !showColorPicker">
        format_color_text
      </button>

      <div v-if="showColorPicker" class="color-palette">
        <div v-for="c in colors" :key="c" class="color-box" :style="{ backgroundColor: c }"
          @click="setColorFromPalette(c)" />
      </div>
    </div>

    <p class="bar">|</p>

    <button class="icon-btn" @click="editor.chain().focus().toggleBulletList().run()"
      :class="{ 'is-active': editor.isActive('bulletList') }">
      format_list_bulleted
    </button>

    <button class="icon-btn" @click="editor.chain().focus().toggleOrderedList().run()"
      :class="{ 'is-active': editor.isActive('orderedList') }">
      format_list_numbered
    </button>
    <button class="icon-btn" @click="editor.chain().focus().sinkListItem('listItem').run()"
      :disabled="!editor.can().sinkListItem('listItem')">
      format_list_bulleted_add
    </button>
    <button class="icon-btn" @click="editor.chain().focus().liftListItem('listItem').run()"
      :disabled="!editor.can().liftListItem('listItem')">
      filter_list_off
    </button>

    <p class="bar">|</p>

    <button class="icon-btn" @click="editor.chain().focus().setTextAlign('left').run()"
      :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }">
      format_align_left
    </button>
    <button class="icon-btn" @click="editor.chain().focus().setTextAlign('center').run()"
      :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }">
      format_align_center
    </button>
    <button class="icon-btn" @click="editor.chain().focus().setTextAlign('right').run()"
      :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }">
      format_align_right
    </button>
    <button class="icon-btn" @click="editor.chain().focus().setTextAlign('justify').run()"
      :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }">
      format_align_justify
    </button>
    <button class="icon-btn" @click="editor.chain().focus().unsetTextAlign().run()">
      format_clear
    </button>
    <p class="bar">|</p>
  </div>
  <editor-content :editor="editor" class="tiptap" />
</template>

<style scoped lang="scss">
.ProseMirror {
  min-height: 600px;
  max-height: 50vh;
  overflow-y: auto;
  padding: 1rem;
  border-radius: 4px;
}

.tiptap {
  :first-child {
    margin-top: 0;
  }
}

.editor-toolbar {
  border: 1px solid #333;
  border-radius: 12px;
  padding: 8px 10px;
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  color: #ccc;
}

.material-symbols-outlined {
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24
}

button.icon-btn {
  all: unset;
  font-size: 20px;
  padding: 6px;
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Material Symbols Outlined';
  color: #343a40;
  transition: background 0.2s, color 0.2s;
}

.icon-btn:hover {
  background-color: #aaa;
  color: #fff;
}

.color-picker-popover {
  position: absolute;
  margin-top: 4px;
  z-index: 10;
}

.color-palette {
  position: absolute;
  top: 100%;
  left: 0;
  display: grid;
  grid-template-columns: repeat(4, 24px);
  gap: 6px;
  background: white;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 999;
}

.color-box {
  width: 24px;
  height: 24px;
  border: 1px solid #aaa;
  border-radius: 11px;
  cursor: pointer;
}


.color-box:hover {
  border-color: #000;
}

.bar {
  height: 21px;
  line-height: 21px;
  font-size: 24px;
  margin: 0 1px;
  color: #aaa;
  display: flex;
  align-items: center;
}

::v-deep(.tiptap p.is-editor-empty:first-child::before) {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

.icon-btn.material-symbols-outlined {
  line-height: 1;
  padding: 6px 8px;
  vertical-align: middle;
}

.upload-dropdown {
  position: relative;
}

.upload-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-top: 4px;
  padding: 8px 0;
  z-index: 999;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  min-width: 140px;
}

.upload-menu-item {
  padding: 6px 12px;
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #333;
}

.upload-menu-item:hover {
  background-color: #eee;
}
</style>
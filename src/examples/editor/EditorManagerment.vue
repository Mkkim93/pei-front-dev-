<template>
  <div class="editor-toolbar mb-3">
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

    <button 
        class="icon-btn"
        @click="editor.chain().focus().toggleUnderline().run()" :class="{ 'is-active': editor.isActive('underline') }">
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
    <button 
      class="icon-btn" 
      @click="editor.chain().focus().toggleBulletList().run()"
      :class="{ 'is-active': editor.isActive('bulletList') }">
      format_list_bulleted
    </button>

    <button 
       class="icon-btn" @click="editor.chain().focus().toggleOrderedList().run()"
      :class="{ 'is-active': editor.isActive('orderedList') }">
      format_list_numbered
    </button>
        <button 
          class="icon-btn"
        @click="editor.chain().focus().sinkListItem('listItem').run()" :disabled="!editor.can().sinkListItem('listItem')">
          format_list_bulleted_add
        </button>
        <button 
        class="icon-btn"
        @click="editor.chain().focus().liftListItem('listItem').run()" 
        :disabled="!editor.can().liftListItem('listItem')">
          filter_list_off
        </button>
        <p class="bar">|</p>
        
        

        <!-- <button 
        class="icon-btn"
        @click="editor.chain().focus().setFontFamily('Inter').run()" :class="{ 'is-active': editor.isActive('textStyle', { fontFamily: 'Inter' }) }">
          Inter
        </button>
        <button 
        class="icon-btn"
        @click="editor.chain().focus().setFontFamily('Comic Sans MS, Comic Sans').run()" :class="{ 'is-active': editor.isActive('textStyle', { fontFamily: 'Comic Sans MS, Comic Sans' }) }">
          Comic Sans
        </button>
        <button 
        class="icon-btn"
        @click="editor.chain().focus().setFontFamily('serif').run()" :class="{ 'is-active': editor.isActive('textStyle', { fontFamily: 'serif' }) }">
          Serif
        </button>
        <button 
        class="icon-btn"
        @click="editor.chain().focus().setFontFamily('monospace').run()" :class="{ 'is-active': editor.isActive('textStyle', { fontFamily: 'monospace' }) }">
          Monospace
        </button>
        <button 
        class="icon-btn"
        @click="editor.chain().focus().setFontFamily('cursive').run()" :class="{ 'is-active': editor.isActive('textStyle', { fontFamily: 'cursive' }) }">
          Cursive
        </button>
        <button 
        class="icon-btn"
        @click="editor.chain().focus().unsetFontFamily().run()">
          Unset font family
        </button> -->

        <button 
        class="icon-btn"
        @click="editor.chain().focus().setTextAlign('left').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }">
          format_align_left
        </button>
        <button 
        class="icon-btn"
        @click="editor.chain().focus().setTextAlign('center').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }">
          format_align_center
        </button>
        <button 
        class="icon-btn"
        @click="editor.chain().focus().setTextAlign('right').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }">
          format_align_right
        </button>
        <button 
        class="icon-btn"
        @click="editor.chain().focus().setTextAlign('justify').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }">
          format_align_justify
        </button>
        <button 
        class="icon-btn"
        @click="editor.chain().focus().unsetTextAlign().run()">
          format_clear
        </button>
        <p class="bar">|</p>
        <button 
        class="icon-btn"
        @click="addImage">
          add_photo_alternate
        </button>
  </div>
  <editor-content :editor="editor" />
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, computed } from 'vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Strike from '@tiptap/extension-strike'
import TextAlign from '@tiptap/extension-text-align'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import CodeBlock from '@tiptap/extension-code-block'
import Link from '@tiptap/extension-link'
import ListItem from '@tiptap/extension-list-item'
import FontFamily from '@tiptap/extension-font-family'
import Text from '@tiptap/extension-text'
import ListKeymap from '@tiptap/extension-list-keymap'
import BulletList from '@tiptap/extension-bullet-list'
import Paragraph from '@tiptap/extension-paragraph'
import OrderedList from '@tiptap/extension-ordered-list'
import Dropcursor from '@tiptap/extension-dropcursor'
import Image from '@tiptap/extension-image'

const url = ref('');
const props = defineProps<{ editor: Editor }>()
const color = ref('#000000');
const showColorPicker = ref(false)


const hasActiveMarks = computed(() =>
  editor.isActive('bold') ||
  editor.isActive('italic') ||
  editor.isActive('underline') ||
  editor.isActive('strike')
)

const editor = new Editor({
  extensions: [
  StarterKit,
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    Paragraph,
    Image.configure({
    allowBase64: true,
    inline: true,
    }),
    Dropcursor,
    Text,
    BulletList,
    OrderedList,
    ListItem,
    ListKeymap,
    TextStyle.configure({ mergeNestedSpanStyles: true }),
    FontFamily,
    Underline,
    Strike,
    Highlight,
    CodeBlock,
    Link,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
  ],
  content: '',
  editorProps: {
    handleDrop(view, event, _slice, moved) {
      if (moved) return false

      const hasFiles = event.dataTransfer?.files?.length > 0
      if (!hasFiles) return false

      const images = Array.from(event.dataTransfer!.files).filter(file =>
        /image/i.test(file.type)
      )

      if (images.length === 0) return false

      event.preventDefault()

      images.forEach(imageFile => {
        const reader = new FileReader()
        reader.onload = () => {
          const base64 = reader.result as string
          // 이미지 삽입
          view.dispatch(
            view.state.tr.replaceSelectionWith(
              view.state.schema.nodes.image.create({ src: base64 })
            )
          )
        }
        reader.readAsDataURL(imageFile)
      })

      return true
    },
  },
})

const addImage = () => {
  const url = window.prompt('URL');

  if (url) {
    editor.chain().focus().setImage({ src: url }).run();
  }
}

const setColorFromPalette = (selectedColor: string) => {
  color.value = selectedColor
  editor.chain().focus().setColor(selectedColor).run()
  showColorPicker.value = false
}

const colors = [
  '#000000', '#FF0000', '#FFA500', '#FFFF00',
  '#008000', '#0000FF', '#800080', '#FFFFFF',
]

onBeforeUnmount(() => {
  editor.destroy()
})
</script>

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

img {
    display: block;
    height: auto;
    margin: 1.5rem 0;
    max-width: 100%;

    &.ProseMirror-selectednode {
      outline: 3px solid var(--purple);
    }
  }

  .bar {
  height: 21px; /* 원하는 높이로 조정 (예: 100%) */
  line-height: 21px;
  font-size: 24px;
  margin: 0 1px;
  color: #aaa;
  display: flex;
  align-items: center;
}
</style>
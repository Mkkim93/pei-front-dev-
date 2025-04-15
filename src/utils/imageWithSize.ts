import Image from '@tiptap/extension-image'

export const ImageWithSize = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '100%',
        parseHTML: element => element.getAttribute('width'),
        renderHTML: attributes => {
          return attributes.width ? { width: attributes.width } : {}
        },
      },
      height: {
        default: null,
        parseHTML: element => element.getAttribute('height'),
        renderHTML: attributes => {
          return attributes.height ? { height: attributes.height } : {}
        },
      },
      style: {
        default: null,
        parseHTML: element => element.getAttribute('style'),
        renderHTML: attributes => {
          return attributes.style ? { style: attributes.style } : {}
        },
      },
    }
  },
})
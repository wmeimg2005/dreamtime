<template>
  <div class="nudify-editor">
    <div ref="imageEditor" class="editor" data-private />
  </div>
</template>

<script>
import ImageEditor from 'tui-image-editor'
import { blackTheme } from '~/modules/editor.theme'

export default {
  computed: {
    photo() {
      return this.$parent.photo
    },
  },

  mounted() {
    this.create()
  },

  methods: {
    /**
     *
     */
    async create() {
      this.photo.editor = new ImageEditor(this.$refs.imageEditor, {
        includeUI: {
          loadImage: {
            path: this.photo.file.path,
            name: this.photo.file.name,
          },
          theme: blackTheme,
          initMenu: 'draw',
          menu: ['draw', 'shape', 'flip', 'rotate', 'text', 'mask'],
        },
        usageStatistics: false,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.nudify-editor {
  @apply h-full;
}

.editor {
  @apply w-full h-full;
}
</style>

<style lang="scss">
.tui-image-editor-control {
  @apply bg-dark-600;
}
</style>

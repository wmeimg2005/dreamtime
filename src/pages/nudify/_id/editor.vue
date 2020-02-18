<template>
  <div class="nudify-editor">
    <div v-if="photo.scaleMode === 'cropjs' || photo.scaleMode === 'overlay'" class="notification notification--warning">
      <span class="icon"><font-awesome-icon icon="exclamation-triangle" /></span>
      <span>The changes will not be reflected in the nudification until you click on the <strong>Reload</strong> button of the Crop/Overlay tool.</span>
    </div>

    <div ref="imageEditor" class="editor" data-private />
  </div>
</template>

<script>
import { tutorial } from '~/modules'

export default {
  computed: {
    photo() {
      return this.$parent.photo
    },
  },

  mounted() {
    this.create()
    tutorial.editor()
  },

  methods: {
    /**
     *
     */
    async create() {
      const ImageEditor = require('tui-image-editor')
      const { blackTheme } = require('~/modules/editor.theme')

      this.photo.editor = new ImageEditor(this.$refs.imageEditor, {
        includeUI: {
          loadImage: {
            path: this.photo.file.path,
            name: this.photo.file.name,
          },
          theme: blackTheme,
          initMenu: 'draw',
          menu: ['draw', 'shape', 'flip', 'rotate', 'filter', 'mask'],
        },
        usageStatistics: false,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.nudify-editor {
  @apply h-full flex flex-col;
}

.editor {
  @apply w-full flex-1;
}
</style>

<style lang="scss">
.tui-image-editor-control {
  @apply bg-dark-600;
}
</style>

<template>
  <div class="nudity-fu" :class="{'is-dragging': isDraggingFile}" @dragenter="onDragEnter">
    <div class="dragging-overlay" @dragover="onDragOver" @dragleave="onDragLeave" @drop="onDrop" />

    <!-- Hidden input -->
    <input
      v-show="false"
      ref="photo"
      type="file"
      accept="image/jpeg, image/png"
      @change="onPhotoSelected" />

    <!-- Action button -->
    <button class="button" @click.prevent="$refs.photo.click()">
      Upload a photo...
    </button>

    <p class="fu-hint">you can drag the file here too</p>
  </div>
</template>

<script>
import _ from 'lodash'
import { ModelPhoto } from '~/modules/models'

export default {
  props: {
    model: {
      type: String,
      default: undefined
    }
  },

  data: () => ({
    isDraggingFile: false
  }),

  created() {
    this.$store.dispatch('nudity/reset')
  },

  methods: {
    start(file) {
      if (_.isNil(file)) {
        alert('It seems that you have not selected a photo!')
        return
      }

      const modelPhoto = new ModelPhoto(null, file.path)

      const validationErrorMessage = modelPhoto.getValidationErrorMessage()

      if (!_.isNil(validationErrorMessage)) {
        alert(validationErrorMessage)
        return
      }

      this.$nudity.start(modelPhoto)

      this.$router.push('/nudity/crop')
    },

    onPhotoSelected(event) {
      const { files } = event.target

      if (files.length === 0) {
        alert('It seems that you have not selected a photo!')
        return
      }

      this.start(files[0])
      event.target.value = ''
    },

    onDragEnter(event) {
      event.dataTransfer.dropEffect = 'copy'
      this.isDraggingFile = true
    },

    onDragLeave() {
      this.isDraggingFile = false
    },

    onDragOver(event) {
      event.preventDefault()
      event.stopPropagation()
      event.dataTransfer.dropEffect = 'copy'
      this.isDraggingFile = true
    },

    onDrop(event) {
      event.preventDefault()
      event.stopPropagation()

      this.isDraggingFile = false

      const { files } = event.dataTransfer

      if (files.length === 0) {
        return
      }

      this.start(files[0])
    }
  }
}
</script>

<style lang="scss">
.nudity-fu {
  @apply flex flex-col justify-center items-center w-full py-20 relative border-4 border-transparent;

  &.is-dragging {
    @apply border-gray-400 border-dotted;

    .dragging-overlay {
      display: block;
    }
  }

  .dragging-overlay {
    @apply bg-white absolute top-0 left-0 right-0 bottom-0 hidden;
    opacity: 0.3;
  }

  .fu-hint {
    @apply text-sm text-gray-600;
  }
}
</style>



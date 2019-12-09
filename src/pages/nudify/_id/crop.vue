<template>
  <div class="nudify-cropper">
    <div class="cropper__crop">
      <canvas ref="cropCanvas" />
    </div>

    <div class="cropper__help">
      <button v-tooltip="'Get recent changes from the editor.'" class="button" @click.prevent="reload">
        <span class="icon"><font-awesome-icon icon="sync" /></span>
        <span>Reload</span>
      </button>

      <section class="box">
        <div class="box__header">
          <h2 class="title">
            <font-awesome-icon icon="crop" /> Manual crop.
          </h2>
        </div>

        <div class="box__content">
          <p>
            This tool allows you to manually crop the photo so that the selected area is resized to 512x512
          </p>

          <p>
            <font-awesome-icon icon="mouse-pointer" /> Move the photo by dragging it with the mouse, you can zoom in or out using the mouse wheel.
          </p>
        </div>
      </section>

      <section class="box">
        <div class="box__header">
          <h2 class="title">
            <font-awesome-icon icon="question-circle" /> How to obtain better results?
          </h2>
        </div>

        <div class="box__content">
          <p>
            <ul>
              <li>Only one person should appear in the photo.</li>
              <li>The person is standing in a straight position without crossing arms or legs.</li>
              <li>The person is looking towards the camera.</li>
              <li>The person wears light clothes. Bikinis work better.</li>
              <li>The person's body is visible and unobstructed.</li>
            </ul>
          </p>
        </div>
      </section>

      <section class="box">
        <div class="box__header">
          <h2 class="title">
            <font-awesome-icon icon="exclamation-triangle" /> Use at your own risk.
          </h2>
        </div>

        <div class="box__content">
          <p>
            This tool can dramatically decrease the quality of the photo, its use is not recommended.
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Cropper from 'cropperjs'

export default {
  computed: {
    photo() {
      return this.$parent.photo
    },

    cropper() {
      return this.photo.cropper
    },
  },

  mounted() {
    this.create()
  },

  methods: {
    /**
     *
     */
    create() {
      this.photo.cropper = new Cropper(this.$refs.cropCanvas, {
        viewMode: 0,
        dragMode: 'move',
        cropBoxMovable: false,
        cropBoxResizable: false,
        toggleDragModeOnDblclick: false,
        minCropBoxWidth: 512,
        minCropBoxHeight: 512,
        maxCropBoxWidth: 512,
        maxCropBoxHeight: 512,
        aspectRatio: 1,
        modal: true,
        guides: true,
        highlight: true,
        autoCropArea: 1,
        wheelZoomRatio: 0.03,
      })

      this.reload()
    },

    async reload() {
      await this.photo.syncEditor()
      this.cropper.replace(this.photo.fileInput.dataURL)
    },
  },
}
</script>

<style lang="scss" scoped>
.nudify-cropper {
  @apply flex h-full;
}

.cropper__help {
  @apply w-1/4 ml-4;

  .button {
    @apply mb-6 w-full;
  }

  .box p {
    @apply text-sm mb-4;
  }

  .box ul {
    @apply ml-4 list-disc;

    li {
      @apply mb-2;
    }
  }
}

.cropper__crop {
  @apply flex-1 h-full;
}
</style>

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
            This tool allows you to manually select the area you want to be cropped from the photo and resized.
          </p>
        </div>
      </section>

      <section class="box">
        <div class="box__header">
          <h2 class="title">
            <font-awesome-icon icon="mouse-pointer" /> Commands
          </h2>
        </div>

        <div class="box__content">
          <p>
            - Increase or decrease the zoom with the mouse wheel.
          </p>

          <p>
            - Click and drag somewhere in the photo to create the crop box.
          </p>

          <p>
            - You can move the crop box by dragging it.
          </p>

          <p>
            - You can increase or decrease the size of the cropbox by dragging any of the anchor points in the corners.
          </p>
        </div>
      </section>

      <section class="box">
        <div class="box__header">
          <h2 class="title">
            <font-awesome-icon icon="exclamation-triangle" /> Warning.
          </h2>
        </div>

        <div class="box__content">
          <p>
            This tool can dramatically decrease the quality of some photos. (blurry photos)
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
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
    async create() {
      const Cropper = require('cropperjs')

      this.photo.cropper = new Cropper(this.$refs.cropCanvas, {
        aspectRatio: 1,
        wheelZoomRatio: 0.05,
      })

      this.reload()
    },

    /**
     *
     */
    async reload() {
      await this.photo.syncEditor()
      this.cropper.replace(this.photo.fileInput.path)
    },
  },
}
</script>

<style lang="scss" scoped>
.nudify-cropper {
  @apply flex h-full;
}

.cropper__crop {
  @apply w-3/4 h-full;
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


</style>

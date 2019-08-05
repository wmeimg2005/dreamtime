<template>
  <div class="nudity-crop">
    <div class="crop-help">
      <section class="box">
        <div class="buttons">
          <nuxt-link to="/" class="button is-danger">Cancel</nuxt-link>
          <button class="button is-success" @click.prevent="crop('nudify')">Nudify!</button>
        </div>
      </section>

      <section class="box">
        <p class="box-title">📷 Photo cropping</p>

        <p class="help-text">
          It is necessary to resize your photo to 512x512, use the tool below to place the portion of the photo you want to transform into the marked box.
        </p>

        <p class="help-text">
          🐭 Move the photo by dragging it with the mouse, you can zoom in or out using the mouse wheel.
        </p>
      </section>

      <section class="box">
        <p class="box-title">🕵️‍️ How to obtain better results?</p>
        <p class="help-text">
          <ul>
            <li>Only one person should appear in the photo.</li>
            <li>The person is standing and looking towards the camera.</li>
            <li>The person wears light clothes. (bikini works better)</li>
            <li>Try to make the person's belly button and legs visible.</li>
          </ul>
        </p>
      </section>
    </div>

    <div class="crop-canvas">
      <canvas ref="photoCanvas" />
    </div>
  </div>
</template>

<script>
import Cropper from 'cropperjs'
import _ from 'lodash'

export default {
  middleware: 'nudity',

  data: () => ({
    // Instance of CropperJS
    cropper: undefined
  }),

  computed: {
    photo() {
      return this.$nudify.photo
    }
  },

  mounted() {
    this.createCropper()
  },

  methods: {
    /**
     *
     */
    async createCropper() {
      this.cropper = new Cropper(this.$refs.photoCanvas, {
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
        guides: false,
        highlight: false,
        autoCropArea: 0.1,
        wheelZoomRatio: 0.03
      })

      const dataURL = await this.photo.getSourceFile().readAsDataURL()

      this.cropper.replace(dataURL)
    },

    /**
     *
     */
    async saveCroppedPhoto() {
      /*
      const data = this.cropper.getCanvasData()
      console.log(data)
      */

      const canvas = this.cropper.getCroppedCanvas({
        width: 512,
        height: 512,
        minWidth: 512,
        minHeight: 512,
        maxWidth: 512,
        maxHeight: 512,
        fillColor: 'white',
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
      })

      const canvasAsDataURL = canvas.toDataURL(
        this.photo.getSourceFile().getMimetype(),
        1
      )

      await this.photo.getCroppedFile().writeDataURL(canvasAsDataURL)
    },

    async crop(next) {
      await this.saveCroppedPhoto()

      if (next === 'settings') {
        this.$router.push('/nudity/settings')
      }

      if (next === 'nudify') {
        this.$router.push('/nudity/results')
      }
    }
  }
}
</script>

<style lang="scss">
.nudity-crop {
  @apply flex h-full;

  .crop-canvas {
    @apply flex-1 h-full;
  }

  .crop-help {
    @apply flex-1 flex flex-col overflow-hidden p-3 overflow-y-auto;

    section {
      .buttons {
        @apply flex justify-center;

        .button {
          @apply flex-1;
        }
      }
    }

    .help-title {
    }

    .help-text {
      @apply text-sm mb-3;

      ul {
        @apply list-disc ml-5;
      }
    }
  }
}
</style>

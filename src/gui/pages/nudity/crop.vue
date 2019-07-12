<template>
  <div class="nudity-crop">
    <div class="crop-canvas">
      <canvas ref="photoCanvas" />
    </div>

    <div class="crop-help">
      <section>
        <p class="help-title">Photo cropping</p>
        <p class="help-text">
          For the transformation to work it is necessary to resize your photo to 512x512 dimensions, use the tool above and move the photo until the person is right in the middle.
        </p>

        <div class="buttons">
          <nuxt-link to="/" class="button is-danger">Cancel</nuxt-link>
          <button class="button" @click.prevent="next">Next</button>
        </div>
      </section>

      <section>
        <p class="help-title">How to obtain better results?</p>
        <p class="help-text">
          <ul>
            <li>Photos where the person is standing and looking towards the camera.</li>
            <li>Photos with light clothes. (bikini works better)</li>
            <li>Try to make the person's face, belly button and legs visible.</li>
          </ul>
        </p>
      </section>
    </div>
  </div>
</template>

<script>
import Cropper from 'cropperjs'
import _ from 'lodash'

export default {
  middleware: 'nudity',

  data: () => ({
    cropper: undefined
  }),

  mounted() {
    this.boot()
  },

  methods: {
    boot() {
      this.createCropper()
    },

    createCropper() {
      this.cropper = new Cropper(this.$refs.photoCanvas, {
        viewMode: 0,
        dragMode: 'move',
        cropBoxMovable: false,
        cropBoxResizable: false,
        toggleDragModeOnDblclick: false,
        minCropBoxWidth: 512,
        minCropBoxHeight: 512,
        modal: true,
        guides: false,
        highlight: false,
        autoCropArea: 0.1
      })

      this.cropper.replace(this.$nudity.modelPhoto.getSourceAsDataURL())
    },

    saveCroppedPhoto() {
      const canvas = this.cropper.getCroppedCanvas({
        width: 512,
        height: 512,
        fillColor: 'black',
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
      })

      const canvasAsDataURL = canvas.toDataURL(
        this.$nudity.modelPhoto.getSourceType()
      )

      this.$nudity.modelPhoto.saveCroppedPhoto(canvasAsDataURL)

      this.$router.push('/nudity/settings')
    },

    next() {
      this.saveCroppedPhoto()
    }
  }
}
</script>

<style lang="scss">
.nudity-crop {
  @apply flex flex-col h-full;

  .crop-canvas {
    height: 512px;
  }

  .crop-help {
    @apply flex-1 flex overflow-hidden p-5 overflow-y-auto;

    section {
      @apply flex-1 p-2;
    }

    .help-title {
      @apply font-bold;
    }

    .help-text {
      @apply text-sm text-gray-800;

      ul {
        @apply list-disc ml-5;
      }
    }
  }
}
</style>

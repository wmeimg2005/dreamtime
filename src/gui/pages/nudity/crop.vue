<template>
  <div class="nudity-crop">
    <div class="crop-help">
      <section class="box">
        <div class="buttons">
          <nuxt-link to="/" class="button is-danger">Cancel</nuxt-link>
          <button class="button" @click.prevent="togglePreferences">
            <span v-if="!isPreferencesVisible">Preferences</span>
            <span v-else>Information</span>
          </button>
          <button class="button is-success" @click.prevent="crop('nudify')">Nudify!</button>
        </div>
      </section>

      <div v-if="!isPreferencesVisible">
        <section class="box">
          <p class="box-title">📷 Photo cropping</p>

          <p class="help-text">
            For now the algorithm can only work with photos of the size of 512x512.
          </p>

          <p class="help-text">
            Use the tool on the right to crop the photo. Try to keep the person in the center and make the body visible.
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
              <li>The person is standing in a straight position without crossing arms or legs.</li>
              <li>The person is looking towards the camera.</li>
              <li>The person wears light clothes. (bikini works better)</li>
              <li>Try to make the person's belly button and legs visible.</li>
            </ul>
          </p>
        </section>
      </div>

      <div v-else>
        <div class="notification">
          These preferences will only be applied to the current photo, you can change the global preferences in <nuxt-link to="/system/settings/preferences">Settings</nuxt-link>.
        </div>

        <!-- Preferences -->
        <settings-preferences v-model="photo.preferences" />
      </div>
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
    cropper: undefined,
    isPreferencesVisible: false
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
        this.$nudify
          .getPhoto()
          .getSourceFile()
          .getMimetype(),
        1
      )

      await this.$nudify
        .getPhoto()
        .getCroppedFile()
        .writeDataURL(canvasAsDataURL)
    },

    async crop(next) {
      await this.saveCroppedPhoto()
      this.$router.push('/nudity/results')
    },

    togglePreferences() {
      this.isPreferencesVisible = !this.isPreferencesVisible
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

    .help-text {
      @apply mb-3;

      ul {
        @apply list-disc ml-5;
      }
    }
  }
}
</style>

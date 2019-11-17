<template>
  <div class="nudity-crop">
    <div class="crop-help">
      <section class="box">
        <div class="buttons">
          <nuxt-link to="/" class="button is-danger">
            Cancel
          </nuxt-link>
          <button class="button" @click.prevent="togglePreferences">
            <span v-if="!isPreferencesVisible">Preferences</span>
            <span v-else>Information</span>
          </button>
          <button class="button is-success" @click.prevent="crop">
            Nudify!
          </button>
        </div>
      </section>

      <div v-if="!isPreferencesVisible">
        <section class="box">
          <p class="box-title">
            📷 Photo cropping
          </p>

          <p class="help-text">
            To be able to generate the dream correctly it is necessary to resize your photo to the size of 512x512
          </p>

          <p class="help-text">
            Use the tool on the right to crop the photo. Try to keep the person in the center and make the body visible.
          </p>

          <p class="help-text">
            🐭 Move the photo by dragging it with the mouse, you can zoom in or out using the mouse wheel.
          </p>
        </section>

        <section class="box">
          <label for="is-cropped">
            <input id="is-cropped" v-model="isCropped" type="checkbox"> My photo is already the size of 512x512, do not crop. <span v-tooltip="'Select this option to ignore the cropping tool on the right and pass the original photo directly to the transformation algorithm.'" class="underline text-sm">?</span>
          </label>
        </section>

        <section class="box">
          <p class="box-title">
            🕵️‍️ How to obtain better results?
          </p>
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
          These preferences will only be applied to the current photo, you can change the global preferences in <nuxt-link to="/system/settings/preferences">
            Settings
          </nuxt-link>.
        </div>

        <!-- Preferences -->
        <settings-preferences v-model="photo.preferences" />
      </div>
    </div>

    <div class="crop-canvas">
      <canvas ref="photoCanvas" />
    </div>

    <div class="cropper" />
  </div>
</template>

<script>
import Cropper from 'cropperjs'

export default {
  middleware: 'nudity',

  data: () => ({
    // Instance of CropperJS
    cropper: undefined,

    isCropped: false,
    isPreferencesVisible: false,
  }),

  computed: {
    photo() {
      return this.$nudify.photo
    },
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
        wheelZoomRatio: 0.03,
      })

      const dataURL = await this.photo.getSourceFile().readAsDataURL()

      this.cropper.replace(dataURL)
    },

    /**
     *
     */
    async saveCroppedPhoto() {
      /**
       * height: 480
        left: 0
        naturalHeight: 300
        naturalWidth: 300
        top: 80.5
        width: 480

        const data = this.cropper.getData()
      console.log(data)
       */

      if (!this.isCropped) {
        const canvas = this.cropper.getCroppedCanvas({
          width: 512,
          height: 512,
          minWidth: 512,
          minHeight: 512,
          maxWidth: 512,
          maxHeight: 512,
          fillColor: 'white',
          imageSmoothingEnabled: true,
          imageSmoothingQuality: 'high',
        })

        await $tools.crop(this.photo, canvas)
      } else {
        this.photo.croppedFile = this.photo.sourceFile
      }
    },

    /**
     *
     */
    async crop() {
      await this.saveCroppedPhoto()
      this.$router.push('/nudity/results')
    },

    /**
     *
     */
    togglePreferences() {
      this.isPreferencesVisible = !this.isPreferencesVisible
    },
  },
}
</script>

<style lang="scss">
.nudity-crop {
  @apply flex h-full;

  .crop-canvas {
    @apply flex-1 h-full;
  }

  .crop-help {
    @apply flex-1 flex flex-col overflow-hidden p-2 overflow-y-auto;

    section {
      .buttons {
        @apply flex justify-center;

        .button {
          @apply flex-1;
        }
      }
    }

    .help-text {
      @apply mb-2;

      ul {
        @apply list-disc ml-4;
      }
    }
  }
}

.crupper {
  color: red;
}

.creeper {
  color: green;
}
</style>

<style>
/*!
 * Cropper.js v1.5.6
 * https://fengyuanchen.github.io/cropperjs
 *
 * Copyright 2015-present Chen Fengyuan
 * Released under the MIT license
 *
 * Date: 2019-10-04T04:33:44.164Z
 */

.cropper-container {
  direction: ltr;
  font-size: 0;
  line-height: 0;
  position: relative;
  -ms-touch-action: none;
  touch-action: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.cropper-container img {
  display: block;
  height: 100%;
  image-orientation: 0deg;
  max-height: none !important;
  max-width: none !important;
  min-height: 0 !important;
  min-width: 0 !important;
  width: 100%;
}

.cropper-wrap-box,
.cropper-canvas,
.cropper-drag-box,
.cropper-crop-box,
.cropper-modal {
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
}

.cropper-wrap-box,
.cropper-canvas {
  overflow: hidden;
}

.cropper-drag-box {
  background-color: #fff;
  opacity: 0;
}

.cropper-modal {
  background-color: #000;
  opacity: 0.5;
}

.cropper-view-box {
  display: block;
  height: 100%;
  outline: 1px solid #39f;
  outline-color: rgba(51, 153, 255, 0.75);
  overflow: hidden;
  width: 100%;
}

.cropper-dashed {
  border: 0 dashed #eee;
  display: block;
  opacity: 0.5;
  position: absolute;
}

.cropper-dashed.dashed-h {
  border-bottom-width: 1px;
  border-top-width: 1px;
  height: calc(100% / 3);
  left: 0;
  top: calc(100% / 3);
  width: 100%;
}

.cropper-dashed.dashed-v {
  border-left-width: 1px;
  border-right-width: 1px;
  height: 100%;
  left: calc(100% / 3);
  top: 0;
  width: calc(100% / 3);
}

.cropper-center {
  display: block;
  height: 0;
  left: 50%;
  opacity: 0.75;
  position: absolute;
  top: 50%;
  width: 0;
}

.cropper-center::before,
.cropper-center::after {
  background-color: #eee;
  content: ' ';
  display: block;
  position: absolute;
}

.cropper-center::before {
  height: 1px;
  left: -3px;
  top: 0;
  width: 7px;
}

.cropper-center::after {
  height: 7px;
  left: 0;
  top: -3px;
  width: 1px;
}

.cropper-face,
.cropper-line,
.cropper-point {
  display: block;
  height: 100%;
  opacity: 0.1;
  position: absolute;
  width: 100%;
}

.cropper-face {
  background-color: #fff;
  left: 0;
  top: 0;
}

.cropper-line {
  background-color: #39f;
}

.cropper-line.line-e {
  cursor: ew-resize;
  right: -3px;
  top: 0;
  width: 5px;
}

.cropper-line.line-n {
  cursor: ns-resize;
  height: 5px;
  left: 0;
  top: -3px;
}

.cropper-line.line-w {
  cursor: ew-resize;
  left: -3px;
  top: 0;
  width: 5px;
}

.cropper-line.line-s {
  bottom: -3px;
  cursor: ns-resize;
  height: 5px;
  left: 0;
}

.cropper-point {
  background-color: #39f;
  height: 5px;
  opacity: 0.75;
  width: 5px;
}

.cropper-point.point-e {
  cursor: ew-resize;
  margin-top: -3px;
  right: -3px;
  top: 50%;
}

.cropper-point.point-n {
  cursor: ns-resize;
  left: 50%;
  margin-left: -3px;
  top: -3px;
}

.cropper-point.point-w {
  cursor: ew-resize;
  left: -3px;
  margin-top: -3px;
  top: 50%;
}

.cropper-point.point-s {
  bottom: -3px;
  cursor: s-resize;
  left: 50%;
  margin-left: -3px;
}

.cropper-point.point-ne {
  cursor: nesw-resize;
  right: -3px;
  top: -3px;
}

.cropper-point.point-nw {
  cursor: nwse-resize;
  left: -3px;
  top: -3px;
}

.cropper-point.point-sw {
  bottom: -3px;
  cursor: nesw-resize;
  left: -3px;
}

.cropper-point.point-se {
  bottom: -3px;
  cursor: nwse-resize;
  height: 20px;
  opacity: 1;
  right: -3px;
  width: 20px;
}

@media (min-width: 768px) {
  .cropper-point.point-se {
    height: 15px;
    width: 15px;
  }
}

@media (min-width: 992px) {
  .cropper-point.point-se {
    height: 10px;
    width: 10px;
  }
}

@media (min-width: 1200px) {
  .cropper-point.point-se {
    height: 5px;
    opacity: 0.75;
    width: 5px;
  }
}

.cropper-point.point-se::before {
  background-color: #39f;
  bottom: -50%;
  content: ' ';
  display: block;
  height: 200%;
  opacity: 0;
  position: absolute;
  right: -50%;
  width: 200%;
}

.cropper-invisible {
  opacity: 0;
}

.cropper-bg {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC');
}

.cropper-hide {
  display: block;
  height: 0;
  position: absolute;
  width: 0;
}

.cropper-hidden {
  display: none !important;
}

.cropper-move {
  cursor: move;
}

.cropper-crop {
  cursor: crosshair;
}

.cropper-disabled .cropper-drag-box,
.cropper-disabled .cropper-face,
.cropper-disabled .cropper-line,
.cropper-disabled .cropper-point {
  cursor: not-allowed;
}

</style>

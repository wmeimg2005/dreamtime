<template>
  <div class="nudity-crop">
    <div class="crop-help">
      <section>
        <p class="help-title">📷 Photo cropping</p>

        <p class="help-text">
          It is necessary to resize your photo to 512x512, use the tool below to place the portion of the photo you want to transform into the marked box.
        </p>

        <p class="help-text">
          🐭 Move the photo by dragging it with the mouse, you can zoom in or out using the mouse wheel.
        </p>


      </section>

      <section>
        <p class="help-title">🕵️‍️ How to obtain better results?</p>
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
    <div class="preferences-container" v-bind:class="{open: this.preferencesOpen}">
      <section class="settings-fields-section">
        <form-inline-field label="Boob Size">
          <div class="slider-container">
            <input type="range" class="slider" in=0.3 max=2 step=0.1 v-model="preferences.boobsSize"></input>
            <span class="min">0.3</span>
            <span class="max">2.0</span>
          </div>

        </form-inline-field>

        <form-inline-field label="Areola Size">
          <div class="slider-container">
            <input type="range" class="slider" in=0.3 max=2 step=0.1 v-model="preferences.areolaSize"></input>
            <span class="min">0.3</span>
            <span class="max">2.0</span>
          </div>

        </form-inline-field>

        <form-inline-field label="Nipple Size">
          <div class="slider-container">
            <input type="range" class="slider" in=0.3 max=2 step=0.1 v-model="preferences.nippleSize"></input>
            <span class="min">0.3</span>
            <span class="max">2.0</span>
          </div>

        </form-inline-field>

        <form-inline-field label="Vagina Size">
          <div class="slider-container">
            <input type="range" class="slider" in=0.3 max=1.5 step=0.1 v-model="preferences.vaginaSize"></input>
            <span class="min">0.3</span>
            <span class="max">1.5</span>
          </div>
        </form-inline-field>

        <form-inline-field label="Pubic Hair">
          <div class="slider-container">
            <input type="range" class="slider" in=0 max=2 step=0.1 v-model="preferences.pubicHairSize"></input>
            <span class="min">None</span>
            <span class="max">2.0</span>
          </div>
        </form-inline-field>
      </section>
    </div>
    <div class="menu">
      <div class="settings">
        <button class="button" @click="toggleSettings()">Generation Settings</button>
      </div>
      <div class="buttons">
        <nuxt-link to="/" class="button is-danger">Cancel</nuxt-link>
        <button class="button is-success" @click.prevent="crop('nudify')">Nudify!</button>
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
    preferencesOpen: false,
    preferences: {}
  }),

  mounted() {
    this.createCropper()
    var settings = {}
    var settings = $tools.fs.readJSON('settings.json')
    this.preferences.boobsSize = settings.preferences.boobsSize
    this.preferences.areolaSize = settings.preferences.areolaSize
    this.preferences.nippleSize = settings.preferences.nippleSize
    this.preferences.vaginaSize = settings.preferences.vaginaSize
    this.preferences.pubicHairSize = settings.preferences.pubicHairSize
    localStorage.setItem('generationSettings', JSON.stringify(this.preferences))
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

      const dataURL = this.$nudify.getPhoto()
        .getSourceFile()
        .readAsDataURL()

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
        this.$nudity.getPhoto.getSourceFile().getMimetype(),
        1
      )

      await this.$nudity.getPhoto()
        .getCroppedFile()
        .writeDataURL(canvasAsDataURL)
    },

    async crop(next) {
      await this.saveCroppedPhoto()

      localStorage.setItem('generationSettings', JSON.stringify(this.preferences))
      this.$router.push('/nudity/results')
    },
    async toggleSettings() {
      this.preferencesOpen = !this.preferencesOpen
    }
  }
}
</script>

<style lang="scss">
.nudity-crop {
  @apply flex flex-col h-full;
.menu {
    display: flex;
    padding: 0px 30px;
  }
  .preferences-container{
    margin: 0px 40px;
    max-height: 0px;
    opacity: 0;
    overflow-y: hidden;
    transition-property: max-height, opacity;
    transition-duration: 0.25s, 0.2s;
    transition-timing-function: ease-in-out, linear;
    .c-inline-field{
      margin-bottom: 1rem;
    }
  }
  .preferences-container.open{
    max-height: 250px;
    opacity: 1;
  }
  .settings-fields-section{
    padding-top: 15px;
  }
  .settings {
    display: inline-block;
  }
  .buttons {
    display: inline-block;
    margin-left: auto;
  }
  .crop-canvas {
    height: 512px;
  }

  .crop-help {
    @apply flex-1 flex overflow-hidden p-5 overflow-y-hidden;

    section {
      @apply flex-1 p-2;
    }

    .help-title {
      @apply font-bold;
    }

    .help-text {
      @apply text-sm mb-3;

      color: #878;

      ul {
        @apply list-disc ml-5;
      }
    }
  }
}
</style>

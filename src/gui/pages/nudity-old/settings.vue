<template>
  <div class="nudity-settings placeholder-container">
    <!-- Body -->
    <div class="container-body" v-show="!isLoading">
      <!-- Crop -->
      <div class="settings-canvas">
        <canvas ref="photoCanvas" />
      </div>

      <div class="settings-panel">
        <div class="panel-help">
          <section>
            <p class="help-title">Photo cropping</p>
            <p
              class="help-text"
            >In order for photo processing to work, it will be necessary to cut out your photo to 512x512 dimensions. Use the tool above to move the photo so that the person is in the center of the highlighted area.</p>
          </section>

          <section>
            <p class="help-title">How to obtain better results?</p>

            <p class="help-text">
              <ul>
                <li>Photos where the person's body is seen from the front.</li>
                <li>Photos with little clothes.</li>
              </ul>
            </p>
          </section>
        </div>

        <div class="panel-options">
          <div class="field">
            <input type="checkbox" v-model="useCpu" />
            Use CPU
            <span class="field-help">Force the photo processing with CPU. (Slower) <strong>Select this option if you do not have an NVIDIA GPU</strong>.</span>
          </div>

          <div class="field" v-show="!useCpu">
            <label class="label">GPU ID:</label>
            <input type="number" v-model="gpuId" min="0" class="input" />
            <span class="field-help">ID of the GPU to use for processing. You probably should not edit this option unless you have problems or have multiple GPUs.</span>
          </div>
        </div>
      </div>
    </div>

    <div class="container-body settings-loading" v-show="isLoading">
      <img :src="fileCroppedData" class="loading-preview" />
      <h2 class="loading-title">Processing...</h2>
      <h3 class="loading-help" v-show="useCpu">May take a few minutes depending on the power of your CPU...</h3>
      <h3 class="loading-help" v-show="!useCpu">May take a few seconds depending on the power of your GPU...</h3>

      <div class="loading-terminal">
        <p v-for="(line, index) in terminalLines" :key="index" class="terminal-line">{{ line }}</p>
      </div>
    </div>

    <!-- Footer -->
    <div class="container-footer" v-show="!isLoading">
      <nuxt-link to="/" class="button is-danger is-xl">Back</nuxt-link>
      <button type="button" class="button is-primary is-xl" @click.prevent="process">Process!</button>
    </div>

    <div class="container-footer" v-show="isLoading">
      <button type="button" class="button is-danger is-xl">Cancel</button>
    </div>
  </div>
</template>

<script>
import Cropper from 'cropperjs'

export default {
  middleware: 'nudity',

  data: () => ({
    cropper: undefined,
    isLoading: false,
    fileCroppedData: undefined,

    useCpu: false,
    gpuId: 0,
    terminalLines: []
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
        autoCropArea: 0.1,
        ready() {

        }
      })

      this.cropper.replace(this.$store.state.nudity.fileData)
    },

    process() {
      const canvas = this.cropper.getCroppedCanvas({
        width: 512,
        height: 512,
        fillColor: 'black',
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
      })

      console.log(canvas.width, canvas.height)

      this.fileCroppedData = canvas.toDataURL(this.$store.state.nudity.fileType)

      this.$nextTick(() => {
        this.isLoading = true

        window.deepTools.saveCroppedPhoto(this.fileCroppedData)
        const processing = window.deepTools.process(this.gpuId, this.useCpu)

        processing.on('stdout', this.onTerminalLog.bind(this))
        processing.once('stderr', this.onTerminalError.bind(this))
        processing.once('ready', this.onTerminalReady.bind(this))
      })
    },

    onTerminalLog(log) {
      this.terminalLines.push(log)
    },

    onTerminalError(err) {
      alert(`Oops! An error has occurred:\n\n${err}`)

      this.isLoading = false
      this.terminalLines = []
    },

    onTerminalReady(code) {
      console.log(code)

      if (code === 0) {
        this.$router.push('/nudity/results')
      } else {
        this.isLoading = false
        this.terminalLines = []
      }
    }
  }
}
</script>

<style lang="scss">
.nudity-settings {
  .container-body {
    @apply flex flex-col;
  }

  .settings-canvas {
    height: 512px;
  }

  .settings-panel {
    @apply flex-1 flex overflow-hidden;

    .panel-help {
      @apply flex-1 p-5 border-r border-gray-300 overflow-y-auto;

      section {
        @apply mb-3;
      }

      .help-title {
        @apply font-bold;
      }

      .help-text {
        @apply text-sm text-gray-800;
      }
    }

    .panel-options {
      @apply flex-1 p-5 overflow-y-auto;
    }
  }

  .settings-loading {
    @apply justify-center items-center px-5;

    .loading-preview {
      @apply mb-5;
      width: 300px;
      height: 300px;
    }

    .loading-title {
      @apply font-bold text-3xl;
    }

    .loading-help {
      @apply text-gray-600 text-xl;
    }

    .loading-terminal {
      @apply mt-6 bg-black p-4 w-full font-mono overflow-y-auto;
      height: 150px;

      .terminal-line {
        @apply block text-white;
      }
    }
  }
}
</style>

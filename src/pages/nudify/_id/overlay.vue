<template>
  <div class="nudify-cropper">
    <div class="cropper__crop">
      <canvas ref="cropCanvas"
              data-private />
    </div>

    <div class="cropper__help">
      <button id="cropper-reload"
              v-tooltip="'Get recent changes from the editor.'"
              class="button"
              @click.prevent="reload">
        <span class="icon"><font-awesome-icon icon="sync" /></span>
        <span>Reload</span>
      </button>

      <section id="cropper-about"
               class="box">
        <div class="box__header">
          <h2 class="title">
            <font-awesome-icon icon="magic" /> Overlay.
          </h2>
        </div>

        <div class="box__content">
          <p>
            This tool allows you to manually select the area you want to be cropped, nudified and then restored to the original photo.
          </p>

          <p>
            It is perfect to preserve the original dimensions of the photo and only nudify a specific area.
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
import { round } from 'lodash'
import { tutorial } from '~/modules'

export default {
  data: () => ({
    cropper: undefined,
  }),

  computed: {
    photo() {
      return this.$parent.photo
    },
  },

  mounted() {
    this.create()
    tutorial.cropper()
  },

  methods: {
    /**
     *
     */
    async create() {
      const Cropper = require('cropperjs')

      const canvas = this.$refs.cropCanvas

      this.cropper = new Cropper(canvas, {
        viewMode: 1,
        aspectRatio: 1,
        wheelZoomRatio: 0.05,
        ready: () => {
          const { cropper } = this
          cropper.setCropBoxData(this.photo.cropData)

          canvas.addEventListener('crop', () => {
            const data = cropper.getData()

            this.photo.cropData = cropper.getCropBoxData()

            this.photo.overlay = {
              startX: round(data.x),
              startY: round(data.y),
              endX: round(data.x) + round(data.width),
              endY: round(data.y) + round(data.height),
            }
          })
        },
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

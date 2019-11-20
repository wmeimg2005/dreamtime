<template>
  <div class="c-uploader">
    <!-- Dropzone -->
    <div
      class="uploader__dropzone"
      :class="{'is-dragging': isDragging}"
      @dragenter="onDragEnter"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop">
      <p class="dropzone-hint">
        📷 Drop the photo here!
      </p>
    </div>

    <div class="uploader__alt">
      <!-- Computer File -->
      <div class="box">
        <div class="box__header">
          <h2 class="title">
            Computer File
          </h2>
          <h3 class="subtitle">
            Select a file from your computer.
          </h3>
        </div>

        <div class="box__content">
          <input
            v-show="false"
            ref="photo"
            type="file"
            accept="image/jpeg, image/png"
            @change="onPhotoSelected">

          <button class="button" @click.prevent="$refs.photo.click()">
            📂 open a photo...
          </button>
        </div>
      </div>

      <!-- Computer Folder
      <div class="box">
        <div class="box__header">
          <h2 class="title">
            Computer Folder
          </h2>
          <h3 class="subtitle">
            All valid photos in the folder will be processed.
          </h3>
        </div>

        <div class="box__content">
          <button class="button" @click.prevent="openFolder">
            📂 import folder...
          </button>
        </div>
      </div>-->

      <!-- Web Address -->
      <div class="box">
        <div class="box__header">
          <h2 class="title">
            Web Address
          </h2>
          <h3 class="subtitle">
            It must be the direct web address to a photo and must end with the jpg, png or gif format.
          </h3>
        </div>

        <div class="box__content">
          <input v-model="webAddress" type="url" class="input mb-2" placeholder="https://">

          <button class="button" @click="onURL">
            Go!
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-param-reassign */
// eslint-disable-next-line lodash/import-scope
import _ from 'lodash'
import swal from 'sweetalert'
import { Photo } from '~/modules/models'
import { File } from '~/modules'

export default {
  props: {
    model: {
      type: String,
      default: undefined,
    },
  },

  data: () => ({
    webAddress: '',

    // Indicates if the user is dragging a file in the window (we apply the drag style)
    isDragging: false,
  }),

  created() {
    // Restarts the information of a previous process
    this.$nudify.reset()
  },

  methods: {
    /**
     * File selected, start a new transformation process
     */
    startFromFile(inputFile) {
      if (_.isNil(inputFile)) {
        swal(
          'Upload failed',
          'It seems that you have not selected a photo!',
          'info',
        )
        return
      }

      // New File instance
      const file = File.fromPath(inputFile.path)

      this.start(file)
    },

    /**
     *
     */
    async startFromURL(url) {
      if (_.isNil(url)) {
        swal('Upload failed', 'This does not seem like a valid URL', 'info')
        return
      }

      swal({
        title: 'Loading...',
        text: 'We are downloading the photo and preparing it!',
        button: false,
        closeOnClickOutside: false,
        closeOnEsc: false,
      })

      try {
        // New File instance
        const file = await File.fromURL(url)

        swal.close()

        this.start(file)
      } catch (err) {
        swal({
          icon: 'error',
          title: 'Upload failed',
          text: `An error has occurred downloading the photo or saving it in the temporary folder, please make sure you are connected to the Internet and that ${
            $dream.name
          } has permissions to save files.`,
        })

        $rollbar.warn(err)
      }
    },

    /**
     *
     */
    start(file) {
      // Create a photo for the model ("null" model for now)
      const photo = new Photo(null, file)

      // Get any error message from the file
      const validationErrorMessage = photo.getValidationErrorMessage()

      if (!_.isNil(validationErrorMessage)) {
        swal('Upload failed', validationErrorMessage, 'error')
        return
      }

      // Start the transformation process!
      this.$nudify.start(photo)

      // It's time to nudify the photo
      this.$router.push('/nudify')
    },

    /**
     *
     */
    openFolder() {

    },

    /**
     *
     */
    onPhotoSelected(event) {
      const { files } = event.target

      if (files.length === 0) {
        return
      }

      $nucleus.track('UPLOAD_SELECTED')

      this.startFromFile(files[0])
      event.target.value = ''
    },

    /**
     *
     */
    onURL() {
      if (_.isNil(this.webAddress) || this.webAddress.length === 0) {
        swal('Upload failed', 'Please enter a valid web address', 'error')
        return
      }

      $nucleus.track('UPLOAD_URL')

      this.startFromURL(this.webAddress)
    },

    /**
     *
     */
    onDragEnter(event) {
      event.dataTransfer.dropEffect = 'copy'
      this.isDragging = true
    },

    /**
     *
     */
    onDragLeave() {
      this.isDragging = false
    },

    /**
     *
     */
    onDragOver(event) {
      event.preventDefault()
      event.stopPropagation()
      event.dataTransfer.dropEffect = 'copy'
      this.isDragging = true
    },

    /**
     *
     */
    onDrop(event) {
      event.preventDefault()
      event.stopPropagation()
      this.isDragging = false

      const { files } = event.dataTransfer
      const externalURL = event.dataTransfer.getData('url')

      if (files.length > 0) {
        $nucleus.track('UPLOAD_DROP')
        this.startFromFile(files[0])
      } else if (externalURL.length > 0) {
        $nucleus.track('UPLOAD_DROP_URL')
        this.startFromURL(externalURL)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.c-uploader {
  @apply w-full relative;

  .uploader__alt {
    @apply flex flex-wrap;

    .box {
      @apply flex flex-col;
      width: 48%;
      min-height: 200px;

      &:not(:last-child) {
        @apply mr-4;
      }

      .box__header {
        h2 {
          @apply text-lg font-bold;
        }

        h3 {
          @apply text-sm mb-4 font-light;
        }

        .help {
          @apply text-xs align-text-top font-bold underline;
          cursor: help;
        }
      }

      .box__content {
        @apply flex-1 flex flex-col justify-center items-center;
      }
    }
  }

  .uploader__dropzone {
    @apply flex items-center justify-center;
    @apply bg-dark-400 mb-6;
    @apply rounded border-2 border-dashed border-gray-600;
    height: 200px;
    transition: all 0.1s linear;

    &.is-dragging {
      @apply bg-dark-700 border-white;

      .dropzone-hint {
        @apply text-white text-xl;
      }
    }

    .dropzone-hint {
      @apply text-generic-300 uppercase;
      transition: all 0.1s linear;
    }
  }

  .upload-url {
    @apply mb-6 flex;

    .input {
      @apply flex-1 mr-4;
    }
  }

  &.is-dragging {
    @apply border-white border-dotted;

    .dragging-overlay {
      //display: block;
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

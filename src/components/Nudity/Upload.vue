<template>
  <div class="c-uploader">
    <div class="uploader__settings box box--items">
      <div class="box__content">
        <box-item
          label="Upload Mode"
          description="Select what should be done when uploading a new photo.">
          <select v-model="$settings.app.uploadMode" class="input">
            <option value="none">
              Stay
            </option>
            <option value="add-queue">
              Start photo transformation
            </option>
            <option value="go-preferences">
              Change photo preferences
            </option>
          </select>
        </box-item>
      </div>
    </div>

    <!-- Dropzone -->
    <div
      class="uploader__dropzone"
      :class="{'is-dragging': isDragging}"
      @dragenter="onDragEnter"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="openDrop">
      <p class="dropzone-hint">
        <font-awesome-icon icon="camera" />
        Drop the photo(s)/folder here!
      </p>
    </div>

    <div class="uploader__alt">
      <!-- File -->
      <div class="box">
        <div class="box__header">
          <h2 class="title">
            <span class="icon"><font-awesome-icon icon="image" /></span>
            <span>File.</span>
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
            accept="image/jpeg, image/png, image/gif"
            multiple
            @change="openFile">

          <button class="button" @click.prevent="$refs.photo.click()">
            <span>open file</span>
          </button>
        </div>
      </div>

      <!-- Folder -->
      <div class="box">
        <div class="box__header">
          <h2 class="title">
            <span class="icon"><font-awesome-icon icon="folder-open" /></span>
            <span>Folder.</span>
          </h2>
          <h3 class="subtitle">
            Select a folder from your computer. All valid photos will be transformed.
          </h3>
        </div>

        <div class="box__content">
          <button class="button" @click.prevent="openFolder">
            <span>import folder</span>
          </button>
        </div>
      </div>

      <!-- Web Address -->
      <div class="box">
        <div class="box__header">
          <h2 class="title">
            <span class="icon"><font-awesome-icon icon="globe" /></span>
            <span>Web Address.</span>
          </h2>
          <h3 class="subtitle">
            Enter the web address of a photo. It must end in a valid extension (jpg, png, gif)
          </h3>
        </div>

        <div class="box__content">
          <input v-model="webAddress" type="url" class="input mb-2" placeholder="https://">

          <button class="button" @click="openUrl">
            Go!
          </button>
        </div>
      </div>

      <!-- Web Address -->
      <div class="box">
        <div class="box__header">
          <h2 class="title">
            <span class="icon"><font-awesome-icon :icon="['fab', 'instagram']" /></span>
            <span>Instagram photo.</span>
          </h2>
          <h3 class="subtitle">
            Enter the web address or Media ID of an Instagram photo.
          </h3>
        </div>

        <div class="box__content">
          <input v-model="instagramPhoto" type="url" class="input mb-2" placeholder="https://www.instagram.com/p/dU4fHDw-Ho/">

          <button class="button" @click="openInstagramPhoto">
            Go!
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-param-reassign */
import {
  isNil, isEmpty, startsWith,
  map, isArray,
} from 'lodash'
import Swal from 'sweetalert2'
import { Nudify } from '~/modules/nudify'

const { nucleus } = $provider.services
const { instagram } = $provider.tools
const { dialog } = $provider.api

export default {
  props: {
    model: {
      type: String,
      default: undefined,
    },
  },

  data: () => ({
    webAddress: '',
    instagramPhoto: '',
    isDragging: false,
  }),

  created() {

  },

  methods: {
    /**
     * File selected, start a new transformation process
     */
    addFile(file) {
      if (isNil(file)) {
        return
      }

      Nudify.addFile(file.path)
    },

    async addFiles(files) {
      if (!isArray(files)) {
        return
      }

      Swal.fire({
        title: 'Importing files...',
        text: 'One moment, please.',
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
      })

      await Nudify.addFiles(files)

      Swal.close()
    },

    /**
     *
     */
    openFile(event) {
      const { files } = event.target

      if (files.length === 0) {
        return
      }

      const paths = map(files, 'path')

      nucleus.track('UPLOAD_FILE')

      this.addFiles(paths)

      event.target.value = ''
    },

    /**
     *
     */
    openFolder() {
      const paths = dialog.showOpenDialogSync({
        properties: ['openDirectory'],
      })

      this.addFiles(paths)
    },

    /**
     *
     */
    openUrl() {
      if (isEmpty(this.webAddress) || (!startsWith(this.webAddress, 'http://') && !startsWith(this.webAddress, 'https://'))) {
        throw new AppError('Please enter a valid web address.', { title: 'Upload failed.', level: 'warning' })
      }

      nucleus.track('UPLOAD_URL')

      Nudify.addUrl(this.webAddress)

      this.webAddress = ''
    },

    /**
     *
     */
    async openInstagramPhoto() {
      if (isEmpty(this.instagramPhoto)) {
        throw new AppError('Please enter a valid Instagram photo.', { title: 'Upload failed.', level: 'warning' })
      }

      let post

      try {
        post = await instagram.getPost(this.instagramPhoto)
      } catch (error) {
        throw new AppError('Unable to download the photo, please verify that the address is correct and that you are connected to the Internet.', { title: 'Upload failed.', error, level: 'warning' })
      }

      if (post.isVideo) {
        throw new AppError('The videos are not supported yet.', { title: 'Upload failed.', level: 'warning' })
      }

      Nudify.addUrl(post.downloadUrl)

      this.instagramPhoto = ''
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
    openDrop(event) {
      event.preventDefault()
      event.stopPropagation()

      this.isDragging = false

      const { files } = event.dataTransfer
      const url = event.dataTransfer.getData('url')

      if (url.length > 0) {
        nucleus.track('UPLOAD_DROP_URL')
        Nudify.addUrl(url)
      } else if (files.length > 0) {
        const paths = map(files, 'path')
        this.addFiles(paths)
        nucleus.track('UPLOAD_DROP')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.c-uploader {
  @apply w-full relative;

  .uploader__alt {
    @apply flex flex-wrap justify-between;

    .box {
      @apply flex flex-col;
      width: calc(1/2*100% - (1 - 1/2)*1rem);
      min-height: 200px;

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
    @apply bg-dark-500 mb-6;
    @apply rounded border-2 border-dashed border-dark-100;
    height: 200px;
    transition: all 0.1s linear;

    &.is-dragging {
      @apply bg-dark-700 border-dark-200;

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

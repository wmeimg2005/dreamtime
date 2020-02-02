<template>
  <div id="uploader" class="uploader">
    <!-- Uploader Selection -->
    <div class="uploader__selection">
      <div class="selection__menu">
        <select
          id="uploader-settings"
          v-model="$settings.app.uploadMode"
          v-tooltip="{ content: 'Upload mode. What will happen when uploading a photo.', placement: 'right' }"
          class="input">
          <option value="add-queue">
            Put in Queue
          </option>
          <option value="none">
            Put in Pending
          </option>
          <option value="go-preferences">
            Put in Pending and Open preferences
          </option>
        </select>

        <div id="uploader-methods" class="box box--items">
          <div class="box__content">
            <box-item
              label="Web"
              icon="globe"
              :is-link="true"
              :class="{'box__item--active': selectionId === 0}"
              @click="selectionId = 0" />

            <box-item
              label="Instagram"
              :icon="['fab', 'instagram']"
              :is-link="true"
              :class="{'box__item--active': selectionId === 1}"
              @click="selectionId = 1" />

            <box-item
              label="File"
              icon="file"
              :is-link="true"
              :class="{'box__item--active': selectionId === 2}"
              @click="selectionId = 2" />

            <box-item
              label="Folder"
              icon="folder-open"
              :is-link="true"
              :class="{'box__item--active': selectionId === 3}"
              @click="selectionId = 3" />

            <box-item
              label="Examples"
              icon="images"
              href="https://time.dreamnet.tech/docs/guide/photos" />
          </div>
        </div>

        <div class="box uploader__hint">
          <div class="box__content">
            <p>
              <font-awesome-icon icon="exclamation-circle" />
              You can drag and drop photos and folders into the application no matter where you are.
            </p>
          </div>
        </div>
      </div>

      <div class="selection__content">
        <!-- Web Address -->
        <div v-show="selectionId === 0" class="selection__content__body">
          <input v-model="webAddress" type="url" class="input mb-2" placeholder="https://" data-private="lipsum">

          <p class="help">
            It must end in a valid extension (jpg, png, gif)
          </p>

          <button class="button" @click="openUrl">
            Submit
          </button>
        </div>

        <!-- Instagram -->
        <div v-show="selectionId === 1" class="selection__content__body">
          <input v-model="instagramPhoto" type="url" class="input mb-2" placeholder="https://www.instagram.com/p/dU4fHDw-Ho/" data-private="lipsum">

          <p class="help">
            Enter the web address or Media ID of an Instagram photo.
          </p>

          <button class="button" @click="openInstagramPhoto">
            Submit
          </button>
        </div>

        <!-- File -->
        <div v-show="selectionId === 2" class="selection__content__body">
          <input
            v-show="false"
            ref="photo"
            type="file"
            accept="image/jpeg, image/png, image/gif"
            multiple
            @change="openFile">

          <button class="button" @click.prevent="$refs.photo.click()">
            <span>Open File</span>
          </button>

          <p class="help">
            Select one or more photos from your computer.
          </p>
        </div>

        <!-- Folder -->
        <div v-show="selectionId === 3" class="selection__content__body">
          <button class="button" @click.prevent="openFolder">
            <span>Open folder</span>
          </button>

          <p class="help">
            Select one or more folders on your computer. All valid photos inside will be uploaded.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  isEmpty, startsWith, map,
} from 'lodash'
import { Nudify } from '~/modules/nudify'
import { tutorial } from '~/modules'
import { UploadMixin } from '~/mixins'

const { instagram } = $provider

export default {
  mixins: [UploadMixin],

  props: {
    model: {
      type: String,
      default: undefined,
    },
  },

  data: () => ({
    selectionId: 0,
    webAddress: '',
    instagramPhoto: '',
  }),

  mounted() {
    tutorial.upload()
  },

  methods: {
    /**
     *
     */
    openFile(event) {
      const { files } = event.target

      if (files.length === 0) {
        return
      }

      const paths = map(files, 'path')

      consola.track('FILE')

      this.addFiles(paths)

      event.target.value = ''
    },

    /**
     *
     */
    openUrl() {
      if (isEmpty(this.webAddress) || (!startsWith(this.webAddress, 'http://') && !startsWith(this.webAddress, 'https://'))) {
        throw new Warning('Upload failed.', 'Please enter a valid web address.')
      }

      Nudify.addUrl(this.webAddress)

      consola.track('URL')

      this.webAddress = ''
    },

    /**
     *
     */
    async openInstagramPhoto() {
      if (isEmpty(this.instagramPhoto)) {
        throw new Warning('Upload failed.', 'Please enter a valid Instagram photo.')
      }

      let post

      try {
        post = await instagram.getPost(this.instagramPhoto)
      } catch (error) {
        throw new Warning('Upload failed.', 'Unable to download the photo, please verify that the address is correct and that you are connected to the Internet.', error)
      }

      if (post.isVideo) {
        throw new Warning('Upload failed.', 'Videos are not supported yet.')
      }

      Nudify.addUrl(post.downloadUrl)

      consola.track('INSTAGRAM')

      this.instagramPhoto = ''
    },
  },
}
</script>

<style lang="scss" scoped>
.uploader {
  @apply w-full relative;
}

.uploader__selection {
  @apply flex;

  .selection__menu {
    @apply mr-4;
    width: 200px;

    .input {
      @apply mb-6;
    }
  }

  .selection__content {
    @apply flex flex-1 items-center justify-center;

    .selection__content__body {
      @apply text-center;
      width: 50%;
    }

    .input {
      @apply mb-4;
    }

    .help {
      @apply text-sm;

      &:not(:last-child) {
        @apply mb-4;
      }
    }

    .button:not(:last-child) {
      @apply mb-4;
    }

    .button {

    }
  }
}

.uploader__hint {
  @apply text-center;

  p {
    @apply text-sm;
  }
}
</style>

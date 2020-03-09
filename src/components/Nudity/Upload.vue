<template>
  <div id="uploader" class="uploader">
    <!-- Uploader Selection -->
    <div class="uploader__selection">
      <div class="selection__content" />
    </div>
  </div>
</template>

<script>
import {
  isEmpty, startsWith, map, toNumber,
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

  }),

  watch: {
    selectionId(value) {
      localStorage.uploadSelectionId = value
    },
  },

  created() {
    this.selectionId = localStorage.uploadSelectionId || 1
    this.selectionId = toNumber(this.selectionId)
  },

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

      consola.track('UPLOAD_FILE')

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

      consola.track('UPLOAD_URL')

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

      consola.track('UPLOAD_INSTAGRAM')

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
      width: 70%;
    }

    .input {
      @apply mb-4;
    }

    .help {
      @apply text-sm text-generic-700;

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

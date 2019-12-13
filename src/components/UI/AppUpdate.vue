<template>
  <!-- Cannot update, only show the version... -->
  <box-item
    v-if="!updater.enabled"
    :label="currentVersion"
    icon="globe" />

  <!-- Updated! -->
  <box-item
    v-else-if="!updater.available"
    :label="`${projectTitle} is up to date.`"
    :description="currentVersion"
    icon="globe" />

  <!-- Update available -->
  <box-item
    v-else-if="!updater.update.active"
    :label="`${projectTitle} ${updater.latest.tag_name} available.`"
    icon="fire-alt"
    class="update-item">
    <button v-tooltip="'Download and install the update automatically.'" type="button" class="button is-sm" @click.prevent="updater.start()">
      Update
    </button>

    <a v-tooltip="'Download the update manually.'" :href="downloadURL" target="_blank" class="button is-sm">
      Manual
    </a>
  </box-item>

  <!-- update... -->
  <!-- eslint-disable-next-line vue/valid-template-root --->
  <box-item
    v-else
    :label="updater.update.status"
    icon="globe">
    <template slot="description">
      <p v-if="updater.update.status === 'Downloading...'" class="item__description">
        <strong>{{ updater.update.progress | progress }}</strong> - {{ updater.update.written | size }}/{{ updater.update.total | size }} MB.
      </p>

      <p v-else class="item__description">
        Wait a few minutes, please do not close the program.
      </p>
    </template>

    <button type="button" class="button is-danger is-sm" @click.prevent="updater.cancel()">
      Cancel
    </button>
  </box-item>
</template>

<script>
import { isString, toNumber } from 'lodash'

/* eslint import/namespace: ['error', { allowComputed: true }] */
import * as updateProviders from '~/modules/updater'

const { shell } = $provider.api
const { getPath } = $provider.paths

export default {
  filters: {
    progress(value) {
      if (isString(value)) {
        // eslint-disable-next-line no-param-reassign
        value = toNumber(value)
      }

      const progress = (value * 100).toFixed(2)
      return `${progress}%`
    },

    size(value) {
      if (isString(value)) {
        // eslint-disable-next-line no-param-reassign
        value = toNumber(value)
      }

      return value.toFixed(2)
    },
  },

  props: {
    project: {
      type: String,
      required: true,
    },

    projectTitle: {
      type: String,
      default: 'Project',
    },
  },

  data: () => ({
    currentVersion: 'v0.0.0',
    updater: {},
  }),

  computed: {
    downloadURL() {
      return this.updater.downloadUrls[0]
    },
  },

  created() {
    this.currentVersion = this.updater.currentVersion
    this.updater = updateProviders[this.project]
  },

  beforeDestroy() {
    this.updater.cancel()
  },

  methods: {
    openDownload() {
      shell.openItem(getPath('downloads'))
    },
  },
}
</script>

<style lang="scss">
@keyframes updateAnim {
  0% {
    @apply bg-transparent;
  }

  50% {
    @apply bg-dark-100;
  }

  100% {
    @apply bg-transparent;
  }
}

.update-item {
  transition: all 0.2s ease-in-out;
  animation-name: updateAnim;
  animation-duration: 2s;
  animation-iteration-count: infinite;

  &:hover {
    animation-name: none;
    background: theme('colors.dark.300') !important;
  }

  .item__label {
    @apply text-white;
  }

  .item__description {
    @apply text-generic-600;
  }
}
</style>

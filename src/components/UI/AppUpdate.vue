<template>
  <!-- Cannot update, only show the version... -->
  <box-section-item
    v-if="!updater.enabled"
    :label="currentVersion"
    icon="🌐" />

  <!-- Updated! -->
  <box-section-item
    v-else-if="!updater.available"
    :label="`${projectTitle} is up to date.`"
    :description="currentVersion"
    icon="🌐" />

  <!-- Update available -->
  <box-section-item
    v-else-if="!updater.update.active"
    :label="`${projectTitle} ${updater.latest.tag_name} available.`"
    icon="🌐"
    class="update-item">
    <button v-tooltip="'Download and install the update automatically.'" type="button" class="button is-sm" @click.prevent="updater.download()">
      Update
    </button>
    <app-external-link v-tooltip="'Download the update manually.'" :href="downloadURL" class="button is-sm">
      Manual
    </app-external-link>
  </box-section-item>

  <!-- update... -->
  <!-- eslint-disable-next-line vue/valid-template-root --->
  <box-section-item
    v-else
    :label="updater.update.text"
    icon="🌐">
    <template slot="description">
      <p v-if="updater.update.text === 'Downloading...'" class="item-description">
        <strong>{{ updater.update.progress | progress }}</strong> - {{ updater.update.mbWritten | size }}/{{ updater.update.mbTotal | size }} MB.
      </p>
      <p v-else class="item-description">
        Wait a few minutes, please do not close the program.
      </p>
    </template>

    <button type="button" class="button is-danger is-sm" @click.prevent="updater.cancel()">
      Cancel
    </button>
  </box-section-item>
</template>

<script>
const { shell } = $provider.api
const { getPath } = $provider.tools.paths

export default {
  filters: {
    progress(value) {
      const progress = (value * 100).toFixed(2)
      return `${progress}%`
    },

    size(value) {
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
  }),

  computed: {
    updater() {
      return $provider.updater[this.project]
    },

    downloadURL() {
      return this.updater.downloadUrls[0]
    },
  },

  created() {
    this.currentVersion = this.updater.currentVersion
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

  .item-label {
    @apply text-white;
  }

  .item-description {
    @apply text-generic-600;
  }
}
</style>

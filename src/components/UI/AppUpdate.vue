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
    v-else-if="!updater.updating.active"
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

  <!-- Updating... -->
  <!-- eslint-disable-next-line vue/valid-template-root --->
  <box-section-item
    v-else
    :label="updater.updating.text"
    icon="🌐">
    <template slot="description">
      <p v-if="updater.updating.text === 'Downloading...'" class="item-description">
        <strong>{{ updater.updating.progress | progress }}</strong> - {{ updater.updating.mbWritten | size }}/{{ updater.updating.mbTotal | size }} MB.
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
export default {
  filters: {
    progress(value) {
      value = (value * 100).toFixed(2)
      // value = Math.round(value * 100)
      return `${value}%`
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
      return this.$updater[this.project]
    },

    downloadURL() {
      return this.updater.getUpdateDownloadURLs()[0]
    },
  },

  async created() {
    this.currentVersion = await this.updater.getCurrentVersion()
  },

  beforeDestroy() {
    this.updater.cancel()
  },

  methods: {
    openDownload() {
      $tools.shell.openItem($tools.paths.get('downloads'))
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

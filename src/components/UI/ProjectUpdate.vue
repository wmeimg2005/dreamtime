<template>
  <div class="project-update">
    <!-- Update available -->
    <div
      v-if="!updater.update.active"
      v-tooltip="'New version'"
      class="update__status">
      <strong>{{ updater.latest.tag_name }}</strong>
    </div>

    <!-- Downloading -->
    <div v-else-if="isDownloading" class="update__status">
      Downloading ~ <strong>{{ updater.update.progress | progress }}</strong> ~ {{ updater.update.written | size }}/{{ updater.update.total | size }} MB.
    </div>

    <!-- Installing -->
    <div v-else-if="isInstalling" class="update__status">
      Installing...
    </div>

    <!-- Download Progress -->
    <div v-show="isDownloading" class="update__progressbar">
      <progress min="0" max="100" :value="updater.update.progress" />
    </div>

    <!-- Actions -->
    <div class="update__actions">
      <button v-show="!updater.update.active" class="button button--success" @click.prevent="updater.start()">
        Start
      </button>

      <button v-show="updater.update.active" class="button button--danger" @click.prevent="updater.cancel()">
        Cancel
      </button>

      <button v-tooltip="'Show a list of links to download the update manually.'" class="button button--info" @click.prevent="$refs.mirrorsDialog.show()">
        Mirrors
      </button>
    </div>

    <!-- Hint -->
    <div class="update__hint">
      <p><a href="https://time.dreamnet.tech/docs/guide/updater" target="_blank">More information and troubleshooting</a>.</p>
    </div>

    <!-- Mirrors Dialog -->
    <dialog ref="mirrorsDialog">
      <div class="dialog__content">
        <ul class="mirrors">
          <li v-for="(item, index) in updater.downloadUrls" :key="index">
            <a :href="item" target="_blank">{{ item | domain }}</a>
          </li>
        </ul>

        <div class="dialog__buttons">
          <button class="button button--danger" @click.prevent="$refs.mirrorsDialog.close()">
            Close
          </button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script>
import { toNumber } from 'lodash'
import * as providers from '~/modules/updater'

export default {
  filters: {
    progress(value) {
      value = toNumber(value).toFixed(2)
      return `${value}%`
    },

    size(value) {
      value = toNumber(value).toFixed(2)
      return value
    },

    domain(value) {
      return (new URL(value)).hostname
    },
  },

  props: {
    project: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    updater: null,
  }),

  computed: {
    currentVersion() {
      return this.updater?.currentVersion || 'v0.0.0'
    },

    isDownloading() {
      return this.updater?.update?.status === 'downloading'
    },

    isInstalling() {
      return this.updater?.update?.status === 'installing'
    },
  },

  created() {
    // eslint-disable-next-line import/namespace
    this.updater = providers[this.project]
  },

  beforeDestroy() {
    this.updater.cancel()
  },
}
</script>

<style lang="scss" scoped>
.project-update {
  @apply flex flex-col items-center justify-center;
}

.update__status {
  @apply mb-6 text-2xl text-white;
}

.update__progressbar {
  @apply mb-6;
  width: 80%;

  progress {
    @apply w-full border-0 bg-dark-600;
    height: 18px;
    border-radius: 9px;

    &::-webkit-progress-bar {
      @apply bg-dark-500;
      border-radius: 9px;
    }

    &::-webkit-progress-value {
      @apply bg-primary-500;
      border-radius: 9px;
    }
  }
}

.update__actions {
  @apply mb-6 text-sm;

  .button {
    &:not(:last-child) {
      @apply mr-4;
    }
  }
}

.update__hint {
  @apply text-sm;

  a {
    @apply text-white underline;
  }
}

.mirrors {
  @apply list-disc ml-6;

  a:hover {
    @apply underline;
  }
}
</style>

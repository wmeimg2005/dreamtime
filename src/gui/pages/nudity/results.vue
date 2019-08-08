<template>
  <div class="nudify-results">
    <app-title>
      <h1 class="title">
        🧜‍♀️ Transforming... {{ photo.timer.duration }}s
      </h1>

      <h3 class="subtitle">
        Your photo is being transformed with the power of your {{ deviceName }}.
      </h3>
    </app-title>

    <div class="content-body">
      <!-- Stats -->
      <div class="nudify-results-stats">
        <div class="stats-item">
          <app-photo :src="sourceDataURL">Original</app-photo>
        </div>

        <div class="stats-item">
          <app-photo :src="croppedDataURL">Cropped</app-photo>
        </div>

        <div v-if="!photo.isLoading" class="box stats-item stats-actions">
          <p>Transformation completed</p>

          <div class="buttons">
            <button type="button" class="button is-success" @click.prevent="togglePreferences">
              <span v-if="!isPreferencesVisible">Change Preferences</span>
              <span v-else>Results</span>
            </button>
            <button type="button" class="button is-danger" @click.prevent="rerun">Rerun all</button>
          </div>

          <div class="buttons">
            <button type="button" class="button is-sm" @click.prevent="openFolder">Open Folder</button>
            <nuxt-link to="/" class="button is-sm">Another photo</nuxt-link>
          </div>
        </div>

        <div v-else class="box stats-item stats-actions">
          <p>Relax, this will take a moment...</p>

          <div class="buttons">
            <button type="button" class="button is-danger" @click.prevent="cancel">Cancel</button>
          </div>
        </div>
      </div>

      <div v-show="!isPreferencesVisible" class="box">
        <nudity-job v-for="(job, index) in photo.jobs" :key="index" :job="job" />
      </div>

      <!-- Preferences -->
      <settings-preferences v-show="isPreferencesVisible" v-model="photo.preferences" />
    </div>
  </div>
  </div>
</template>

<script>
export default {
  middleware: 'nudity',

  data: () => ({
    isPreferencesVisible: false,

    sourceDataURL: undefined,
    croppedDataURL: undefined
  }),

  computed: {
    photo() {
      return this.$nudify.photo
    },

    /**
     *
     */
    preferences() {
      return this.$nudify.photo.preferences
    },

    /**
     *
     */
    deviceName() {
      return $settings.processing.device
    }
  },

  async created() {
    this.sourceDataURL = await this.photo.getSourceFile().readAsDataURL()
    this.croppedDataURL = await this.photo.getCroppedFile().readAsDataURL()
  },

  mounted() {
    if (process.env.NODE_ENV === 'production') {
      this.photo.start()
    }
  },

  beforeDestroy() {
    this.photo.cancel()
  },

  methods: {
    /**
     *
     */
    rerun() {
      this.isPreferencesVisible = false
      this.photo.rerun()
    },

    /**
     *
     */
    cancel() {
      this.photo.cancel()
    },

    /**
     *
     */
    openFolder() {
      $tools.shell.openItem(this.photo.getFolderPath())
    },

    /**
     *
     */
    togglePreferences() {
      this.isPreferencesVisible = !this.isPreferencesVisible
    }
  }
}
</script>

<style lang="scss">
.nudify-results {
  .nudify-results-stats {
    @apply flex mb-5;

    .stats-item {
      @apply mb-0;

      &:not(:last-child) {
        @apply mr-5;
      }
    }

    .stats-actions {
      @apply flex-1 flex flex-col justify-center items-center;

      .buttons {
        @apply mt-3;
      }
    }

    .box {
      &:not(:last-child) {
        @apply mr-3;
      }

      /*
      &.is-photo {
        @apply flex flex-col justify-center items-center;
      }
      */

      figure {
        @apply flex justify-center;
        box-sizing: content-box;

        img {
        }
      }
    }
  }
}
</style>

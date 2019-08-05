<template>
  <div class="nudify-results">
    <app-title>
      <h1 class="title">
        🧜‍♀️ Loading... {{ photo.timer.duration }}s
      </h1>

      <h3 class="subtitle">
        Your photo is being transformed with the power of your {{ deviceName }}!
      </h3>
    </app-title>

    <div class="content-body">
      <div class="nudify-results-stats">
        <div class="box stats-item flex-1">
          <p>Test</p>
        </div>

        <div class="stats-item">
          <app-photo :src="sourceDataURL">Original</app-photo>
        </div>

        <div class="stats-item">
          <app-photo :src="croppedDataURL">Cropped</app-photo>
        </div>
      </div>

      <nudity-job v-for="(job, index) in photo.jobs" :key="index" :job="job" />
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'nudity',

  data: () => ({
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

  watch: {
    /*
    '$nudify.modelPhoto.cliLines'() {
      this.$nextTick(() => {
        this.$refs.cli.scrollTo(0, this.$refs.cli.scrollHeight)
      })
    }
    */
  },

  async created() {
    this.sourceDataURL = await this.photo.getSourceFile().readAsDataURL()
    this.croppedDataURL = await this.photo.getCroppedFile().readAsDataURL()
  },

  mounted() {
    this.$nudify.photo.start()
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

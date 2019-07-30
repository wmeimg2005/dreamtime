<template>
  <div class="nudity-loading">
    <app-title>
      <h1 class="title">
        🧜‍♀️ Loading... {{ $nudity.modelPhoto.timer.duration }}s
      </h1>

      <h3 class="subtitle">
        Your photo is being transformed with the power of your {{ deviceName }}!
      </h3>
    </app-title>

    <div class="content-body">
      <nudity-job v-for="(job, index) in $nudity.modelPhoto.outputs" :key="index" :job="job" />
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'nudity',

  computed: {
    /**
     *
     */
    preferences() {
      return this.$nudity.modelPhoto.preferences
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
    '$nudity.modelPhoto.cliLines'() {
      this.$nextTick(() => {
        this.$refs.cli.scrollTo(0, this.$refs.cli.scrollHeight)
      })
    }
    */
  },

  mounted() {
    this.$nudity.modelPhoto.start()
  }
}
</script>

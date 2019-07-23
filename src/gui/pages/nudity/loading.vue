<template>
  <div class="nudity-loading">
    <app-title>
      <h1 class="title">
        🧜‍♀️ Loading... {{ $nudity.modelPhoto.transformation.duration }}s
      </h1>

      <h3 class="subtitle">
        Your photo is being transformed with the power of your {{ deviceName }}!
      </h3>
    </app-title>

    <div class="content-body">

    </div>
  </div>
</template>

<script>
export default {
  middleware: 'nudity',

  computed: {
    preferences() {
      return this.$nudity.modelPhoto.transformation.preferences
    },

    /**
     *
     */
    deviceName() {
      return $settings.processing.device
    }
  },

  watch: {
    '$nudity.modelPhoto.cliLines'() {
      this.$nextTick(() => {
        this.$refs.cli.scrollTo(0, this.$refs.cli.scrollHeight)
      })
    }
  }
}
</script>

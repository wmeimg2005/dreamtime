<template>
  <div class="nudify-summary">
    <div class="summary__photos">
      <app-photo :src="sourceDataURL">
        Original
      </app-photo>

      <app-photo v-show="croppedDataURL" :src="croppedDataURL">
        Cropped
      </app-photo>
    </div>

    <div class="flex justify-center">
      <section class="box">
        <div class="box__content">
          <nuxt-link to="/" class="button is-danger">
            Cancel
          </nuxt-link>

          <button v-show="!photo.running" class="button is-success" @click="nudify">
            Dream!
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    sourceDataURL: null,
    croppedDataURL: null,
  }),

  computed: {
    photo() {
      return this.$nudify.photo
    },
  },

  created() {
    this.setup()
  },

  methods: {
    async setup() {
      this.sourceDataURL = await this.photo.file.readAsDataURL()
    },

    nudify() {
      this.photo.start()
      this.$router.push('/nudify/results')
    },
  },
}
</script>

<style lang="scss" scoped>
.nudify-summary {

}

.summary__photos {
  @apply flex justify-center mb-4;
}
</style>

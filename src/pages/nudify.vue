<template>
  <div class="nudify">
    <app-title>
      <h1 class="title">
        💭 Dream factory.
      </h1>

      <h3 class="subtitle">
        From here you can control your perfect dream.
      </h3>
    </app-title>

    <div class="content__body">
      <div class="nudify__nav">
        <div class="nudify__nav__item flex-1">
          <div class="buttons is-group is-center">
            <nuxt-link to="/nudify/summary" class="button is-outlined is-sm">
              Summary
            </nuxt-link>

            <nuxt-link to="/nudify/preferences" class="button is-outlined is-sm">
              Preferences
            </nuxt-link>

            <nuxt-link v-show="photo.preferences.advanced.scaleMode === 'cropjs'" to="/nudify/crop" class="button is-outlined is-sm">
              Crop
            </nuxt-link>

            <nuxt-link to="/nudify/results" class="button is-outlined is-sm">
              Results
            </nuxt-link>
          </div>
        </div>
      </div>

      <div class="nudify__content">
        <nuxt-child keep-alive />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'nudity',

  computed: {
    photo() {
      return this.$nudify.photo
    },
  },

  beforeDestroy() {
    this.cancel()
  },

  methods: {
    /**
     *
     */
    cancel() {
      this.photo.cancel()
    },
  },
}
</script>

<style lang="scss" scoped>
.nudify {
  height: 100%;
}

.nudify__nav {
  @apply flex mb-6;
}

.nudify__content {
  height: calc(100% - 30px);
}
</style>

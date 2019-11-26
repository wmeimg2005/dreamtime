<template>
  <div v-if="photo" class="nudify">
    <div class="content__body">
      <div class="nudify__nav">
        <div class="nudify__nav__item flex-1">
          <div class="buttons is-group is-center">
            <nuxt-link :to="`/nudify/${photo.id}/summary`" class="button is-outlined is-sm">
              Summary
            </nuxt-link>

            <nuxt-link :to="`/nudify/${photo.id}/preferences`" class="button is-outlined is-sm">
              Preferences
            </nuxt-link>

            <nuxt-link v-show="photo.preferences.advanced.scaleMode === 'cropjs'" :to="`/nudify/${photo.id}/crop`" class="button is-outlined is-sm">
              Crop
            </nuxt-link>

            <nuxt-link :to="`/nudify/${photo.id}/results`" class="button is-outlined is-sm">
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
import { isNil } from 'lodash'
import { Nudify } from '~/modules/nudify'

export default {
  data: () => ({
    photo: null,
  }),

  created() {
    const { params } = this.$route

    if (isNil(params.id)) {
      this.$router.push('/')
      return
    }

    this.photo = Nudify.getPhoto(params.id)

    if (isNil(this.photo)) {
      this.$router.push('/')
    }

    this.photo.status = 'tezst'
  },

  beforeDestroy() {
    this.cancel()
  },

  methods: {
    /**
     *
     */
    cancel() {
      // this.photo.cancel()
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

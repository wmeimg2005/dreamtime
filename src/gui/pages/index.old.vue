<template>
  <div class="photoselection placeholder-container">
    <div class="container-body">
      <h1 class="app-title">
        {{ app.name }}
      </h1>
      <h3 class="app-welcome">
        Welcome to the
        <strong>{{ app.status }}</strong> version.
      </h3>
    </div>

    <div class="container-footer">
      <input
        v-show="false"
        ref="photo"
        type="file"
        accept="image/jpeg, image/png"
        @change="onPhoto" />

      <button
        type="button"
        class="button is-primary is-xl"
        @click.prevent="selectPhoto">
        Select photo
      </button>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  data: () => ({
    file: undefined
  }),

  methods: {
    selectPhoto() {
      this.$refs.photo.click()
    },

    onPhoto(event) {
      const filepath = _.get(event.target, 'files[0].path')
      const fileType = _.get(event.target, 'files[0].type')
      const validate = window.deepTools.isValidPhoto(filepath)

      this.$refs.photo.value = ''

      if (validate !== true) {
        alert(validate)
        return
      }

      console.log({
        file: event.target.files[0],
        filepath,
        fileType
      })

      this.$store.dispatch('nudity/setPhoto', {
        filepath,
        fileType
      })

      this.$router.push('/nudity/settings')
    }
  }
}
</script>

<style lang="scss">
.photoselection {
  .container-body {
    @apply flex flex-col items-center justify-center;
  }

  .app-title {
    @apply text-3xl font-bold;
  }

  .app-welcome {
    @apply text-xl text-gray-600;
  }
}
</style>

<template>
  <div class="nudity-results placeholder-container">
    <div class="container-body">
      <h1 class="title">Transformation completed</h1>

      <img :src="fileData" class="results-preview" />

      <button type="button" class="button is-primary" @click.prevent="save">Save</button>
    </div>

    <div class="container-footer">
      <nuxt-link to="/" class="button is-xl">Another one</nuxt-link>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import download from 'downloadjs'
import moment from 'moment'

export default {
  data: () => ({
    fileData: undefined
  }),

  created() {
    this.boot()
  },

  methods: {
    boot() {
      this.fileData = window.deepTools.getOutputAsDataURL()
    },

    save() {
      const now = moment().format('MM-DD-YYYY_HH:mm')
      const filename = `${now}.png`
      download(this.fileData, filename, 'image/png')
    }
  }
}
</script>

<style lang="scss">
.nudity-results {
  .container-body {
    @apply flex flex-col items-center justify-center;
  }

  .title {
    @apply font-bold text-3xl;
  }

  .results-preview {
    @apply mb-5;
    width: 512px;
    height: 512px;
  }
}
</style>

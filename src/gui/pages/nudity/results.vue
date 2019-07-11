<template>
  <div class="nudity-results">
    <app-title>
      <h1 class="title">
        📷 Transformation in {{ $nudity.transformationDuration }}s
      </h1>

      <h3 class="subtitle">
        Remember to visit our server in <nuxt-link to="/about">Discord</nuxt-link> to share and discuss changes
      </h3>
    </app-title>

    <div class="content-body">
      <nudity-preview :width="412" :height="412" />

      <div class="buttons">
        <button type="button is-success" class="button" @click.prevent="save">Save</button>
        <br /><br />
        <button type="button is-primary" class="button" @click.prevent="openDirectory">Open directory</button>
        <nuxt-link to="/" class="button is-danger">Another one</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import download from 'downloadjs'
import moment from 'moment'

export default {
  middleware: 'nudity',

  data: () => ({
    outputDataURL: undefined
  }),

  created() {
    this.boot()
  },

  methods: {
    boot() {
      this.outputDataURL = this.$nudity.modelPhoto.getOutputAsDataURL()
    },

    save() {
      const now = moment().format('MM-DD-YYYY-HH-mm')
      const filename = `${now}.png`
      download(this.outputDataURL, filename, 'image/png')
    },

    openDirectory() {
      window.deepTools.shellOpenItem(this.$nudity.modelPhoto.getFolderPath())
    }
  }
}
</script>

<style lang="scss">
.nudity-results {
  .buttons {
    @apply text-center;
  }
}
</style>

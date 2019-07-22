<template>
  <div class="settings-fields">
    <section class="settings-fields-section">
      <form-inline-field
        label="Models"
        hint="Location where the transformed photos of the models will be saved.">
        <input v-model="currentValue.folders.models" class="input" />
        <button type="button" class="button" @click.prevent="changeModels">📂</button>
      </form-inline-field>

      <form-inline-field
        label="Cropped"
        hint="Location where the cropped photos will be saved. We recommend selecting a temporary folder.">
        <input v-model="currentValue.folders.cropped" class="input" />
        <button type="button" class="button" @click.prevent="changeCropped">📂</button>
      </form-inline-field>

      <form-inline-field
        label="Masks"
        hint="Location where the algorithm masks photos will be saved.">
        <input v-model="currentValue.folders.masks" class="input" />
        <button type="button" class="button" @click.prevent="changeMasks">📂</button>
      </form-inline-field>
    </section>
  </div>
</template>

<script>
import _ from 'lodash'
import { VModel } from '~/mixins'

export default {
  mixins: [VModel],

  data: () => ({}),

  created() {},

  methods: {
    showOpenDialog(path) {
      const dir = $tools.shell.showOpenDialog(null, {
        defaultPath: path,
        properties: ['openDirectory']
      })

      if (_.isNil(dir)) {
        return path
      }

      if (!$tools.fs.exists(dir[0])) {
        // ???
        return path
      }

      return dir[0]
    },

    changeModels() {
      const dir = this.showOpenDialog(this.currentValue.folders.models)
      this.currentValue.folders.models = dir
    },

    changeCropped() {
      const dir = this.showOpenDialog(this.currentValue.folders.cropped)
      this.currentValue.folders.cropped = dir
    },

    changeMasks() {
      const dir = this.showOpenDialog(this.currentValue.folders.masks)
      this.currentValue.folders.masks = dir
    }
  }
}
</script>

<style lang="scss" scoped>
p {
  @apply mb-5;
}
</style>



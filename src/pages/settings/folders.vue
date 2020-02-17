<template>
  <div class="settings-folders" scoped>
    <div v-if="$dream.isPortable" class="notification">
      <span class="icon"><font-awesome-icon icon="exclamation-triangle" /></span>
      <span>To maximize portability these options cannot be changed in the portable version.</span>
    </div>

    <div v-else class="notification">
      <span class="icon"><font-awesome-icon icon="info-circle" /></span>
      <span>Changing this options needs a restart to take effect.</span>
    </div>

    <section class="box box--items">
      <div class="box__content">
        <box-item
          label="DreamPower"
          description="Algorithm location.">
          <input
            v-if="!$dream.isPortable"
            v-model="currentValue.folders.cli"
            :disabled="$dream.isPortable"
            readonly
            class="input"
            title="Change"
            @click.prevent="changePower">

          <input
            v-else
            disabled
            readonly
            :value="paths.getPowerPath()"
            class="input">
        </box-item>

        <box-item
          label="Models"
          description="Location where all nudified photos will be saved.">
          <input
            v-if="!$dream.isPortable"
            v-model="currentValue.folders.models"
            :disabled="$dream.isPortable"
            class="input"
            readonly
            title="Change"
            @click.prevent="changeModels">

          <input
            v-else
            disabled
            readonly
            :value="paths.getModelsPath()"
            class="input">
        </box-item>

        <box-item
          label="Cropped"
          description="Location where the cropped and editor photos will be saved before nudifying.">
          <input
            v-if="!$dream.isPortable"
            v-model="currentValue.folders.cropped"
            :disabled="$dream.isPortable"
            class="input"
            readonly
            title="Change"
            @click.prevent="changeCropped">

          <input
            v-else
            disabled
            readonly
            :value="paths.getCropPath()"
            class="input">
        </box-item>

        <box-item
          label="Masks"
          description="Location where the algorithm masks photos will be saved.">
          <input
            v-if="!$dream.isPortable"
            v-model="currentValue.folders.masks"
            :disabled="$dream.isPortable"
            class="input"
            readonly
            title="Change"
            @click.prevent="changeMasks">

          <input
            v-else
            disabled
            readonly
            :value="paths.getMasksPath()"
            class="input">
        </box-item>
      </div>
    </section>
  </div>
</template>

<script>
import _ from 'lodash'
import { VModel } from '~/mixins'

const { paths } = $provider
const { existsSync } = $provider.fs
const { dialog } = $provider.api

export default {
  mixins: [VModel],

  data: () => ({
    paths,
  }),

  methods: {
    showOpenDialog(path) {
      const dir = dialog.showOpenDialogSync({
        defaultPath: path,
        properties: ['openDirectory'],
      })

      if (_.isNil(dir)) {
        return path
      }

      if (!existsSync(dir[0])) {
        // ???
        return path
      }

      return dir[0]
    },

    changeModels() {
      if (this.$dream.isPortable) {
        return
      }

      const dir = this.showOpenDialog(this.currentValue.folders.models)
      this.currentValue.folders.models = dir
    },

    changeCropped() {
      if (this.$dream.isPortable) {
        return
      }

      const dir = this.showOpenDialog(this.currentValue.folders.cropped)
      this.currentValue.folders.cropped = dir
    },

    changeMasks() {
      if (this.$dream.isPortable) {
        return
      }

      const dir = this.showOpenDialog(this.currentValue.folders.masks)
      this.currentValue.folders.masks = dir
    },

    changePower() {
      if (this.$dream.isPortable) {
        return
      }

      const dir = this.showOpenDialog(this.currentValue.folders.cli)
      this.currentValue.folders.cli = dir
    },
  },
}
</script>

<style lang="scss" scoped>
.settings-folders {
  .input {
    @apply cursor-pointer;
  }

  .notification {
    @apply mb-4;
  }
}
</style>

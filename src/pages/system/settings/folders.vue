<template>
  <div class="settings-folders" scoped>
    <div class="notification">
      Changing this options needs a restart to take effect.
    </div>

    <section class="box box--items">
      <div class="box__content">
        <box-item
          label="DreamPower"
          description="Location of DreamPower (also known as CLI)">
          <input v-model="currentValue.folders.cli" readonly class="input" title="Change" @click.prevent="changePower">
        </box-item>

        <box-item
          label="Models"
          description="Location where the transformed photos will be saved.">
          <input v-model="currentValue.folders.models" class="input" readonly title="Change" @click.prevent="changeModels">
        </box-item>

        <box-item
          label="Cropped"
          description="Location where the cropped photos will be saved. We recommend selecting a temporary folder.">
          <input v-model="currentValue.folders.cropped" class="input" readonly title="Change" @click.prevent="changeCropped">
        </box-item>

        <box-item
          v-if="false"
          label="Masks"
          description="Location where the algorithm masks photos will be saved.">
          <input v-model="currentValue.folders.masks" class="input" readonly title="Change" @click.prevent="changeMasks">
        </box-item>
      </div>
    </section>
  </div>
</template>

<script>
import _ from 'lodash'
import { VModel } from '~/mixins'

export default {
  mixins: [VModel],

  data: () => ({}),

  created() {
    $nucleus.track('PAGE_SETTINGS_FOLDERS')
  },

  methods: {
    showOpenDialog(path) {
      const dir = $tools.shell.showOpenDialog(null, {
        defaultPath: path,
        properties: ['openDirectory'],
      })

      console.log(dir)

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
    },

    changePower() {
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

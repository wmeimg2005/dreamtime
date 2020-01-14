<template>
  <!-- Results -->
  <div v-if="photo.started" class="results">
    <!-- Quick settings -->
    <div class="box box--items box--items--horizontal">
      <div class="box__content">
        <box-item v-tooltip="{placement: 'bottom', content: 'Scale method'}">
          <select
            v-model="photo.preferences.advanced.scaleMode"
            :disabled="photo.running"
            class="input input--sm">
            <option value="none">
              None
            </option>
            <option value="auto-rescale">
              Fixed
            </option>
            <option value="auto-resize">
              Scale and pad
            </option>
            <option value="auto-resize-crop">
              Scale and crop
            </option>
            <option value="overlay">
              Overlay
            </option>
            <option value="cropjs">
              Manual crop
            </option>
          </select>
        </box-item>

        <box-item v-tooltip="{placement: 'bottom', content: 'Color transfer'}">
          <select
            v-model="photo.preferences.advanced.useColorTransfer"
            :disabled="photo.running"
            class="input input--sm">
            <option :value="true">
              Enabled
            </option>
            <option :value="false">
              Disabled
            </option>
          </select>
        </box-item>
      </div>
    </div>

    <!-- Runs -->
    <div class="runs">
      <nudify-photo-run v-for="(run, index) in photo.runs" :key="index" :run="run" />
    </div>
  </div>

  <!-- Waiting -->
  <div v-else-if="photo.waiting" class="results">
    <div class="results__status">
      <font-awesome-icon icon="cloud-sun-rain" class="icon" />

      <h2>
        Waiting for other dreams to end...
      </h2>
    </div>
  </div>

  <!-- Pending -->
  <div v-else class="results">
    <div class="results__status">
      <font-awesome-icon icon="cloud-moon" class="icon" />

      <h2>
        Add me to the queue to dream together.
      </h2>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    photo() {
      return this.$parent.photo
    },

    /**
     *
     */
    preferences() {
      return this.photo.preferences
    },
  },
}
</script>

<style lang="scss" scoped>
.results {
  @apply h-full;
}

.results__status {
  @apply flex flex-col justify-center items-center h-full;

  .icon {
    @apply text-6xl text-white mb-4;
  }

  h2 {
    @apply text-2xl;
  }
}

.runs {
  @apply flex flex-wrap justify-between;

  .photo-run {
    @apply mb-2;
    width: calc(1/2*100% - (1 - 1/2)*1rem);

    @screen xl {
      width: calc(1/3*100% - (1 - 1/3)*1rem);
    }

    @media (min-height: 1280px) {
      height: 1024px;
    }
  }
}
</style>

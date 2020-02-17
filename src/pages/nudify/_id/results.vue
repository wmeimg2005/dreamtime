<template>
  <!-- Results -->
  <div v-if="photo.started" class="results">
    <!-- Tool alert -->
    <div v-if="photo.isScaleModeCorrected" class="notification notification--warning">
      <span class="icon"><font-awesome-icon icon="exclamation-triangle" /></span>
      <span>The scale method is set to <strong>Crop/Overlay</strong> but the tool has not been used. The photos will be nudified with <strong>Fixed</strong> instead.</span>
    </div>

    <!-- Quick settings -->
    <div class="box box--items box--items--horizontal">
      <div class="box__content">
        <box-item v-tooltip="{placement: 'bottom', content: 'Scale method. Indicates how the photo will be scaled, this changes the quality of the result dramatically.'}">
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
              Crop
            </option>
          </select>
        </box-item>

        <box-item v-tooltip="{placement: 'bottom', content: 'Color transfer. Use a experimental algorithm to try to recover the original colors of the photo.'}">
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
  @apply flex flex-wrap;

  .photo-run {
    @apply w-1/2;

    @media (min-height: 1280px) {
      height: 1024px;
    }
  }
}
</style>

<template>
  <div class="alerts content__body">
    <div class="wrapper">
      <!-- Models Folder -->
      <div v-if="!requirements.folders.models" class="notification notification--danger">
        <span class="icon"><font-awesome-icon icon="exclamation-triangle" /></span>
        <span v-if="!$dream.isPortable">The <strong>Models</strong> folder has <strong>invalid characters</strong>. Please change the location of the folder in the <nuxt-link to="/settings/folders">settings</nuxt-link>.</span>
        <span v-else>The place where you have extracted {{ $dream.name }} has <strong>invalid characters</strong>. Please move the application to another place.</span>
      </div>
      <div v-else class="notification notification--success">
        <span class="icon"><font-awesome-icon icon="check-circle" /></span>
        <span>The <strong>Models</strong> folder is valid. There should be no problems saving the nudified photos.</span>
      </div>

      <!-- GPU -->
      <div v-if="$settings.processing.device === 'GPU'">
        <div v-if="!requirements.recommended.vram" class="notification notification--danger">
          <span class="icon"><font-awesome-icon icon="exclamation-triangle" /></span>
          <span>Your NVIDIA GPU has less than <strong>4 GB</strong> of VRAM.</span>
        </div>
        <div v-else class="notification notification--success">
          <span class="icon"><font-awesome-icon icon="check-circle" /></span>
          <span>Your NVIDIA GPU meets the minimum amount of VRAM.</span>
        </div>
      </div>

      <!-- RAM -->
      <div v-if="!requirements.recommended.ram" class="notification notification--warning">
        <span class="icon"><font-awesome-icon icon="exclamation-triangle" /></span>
        <span>Your system has less than <strong>8 GB</strong> of RAM. Please buy more RAM!</span>
      </div>
      <div v-else class="notification notification--success">
        <span class="icon"><font-awesome-icon icon="check-circle" /></span>
        <span>Your system meets the minimum amount of RAM.</span>
      </div>

      <!-- Windows Media Feature Pack -->
      <div v-if="is.windows">
        <div v-if="!requirements.windows.media" class="notification notification--warning">
          <span class="icon"><font-awesome-icon icon="exclamation-triangle" /></span>
          <span>The <strong>Windows Media Feature Pack</strong> is not installed. You can <a href="https://www.microsoft.com/en-us/software-download/mediafeaturepack" target="_blank">install it</a> or ignore this warning.</span>
        </div>
        <div v-else class="notification notification--success">
          <span class="icon"><font-awesome-icon icon="check-circle" /></span>
          <span>The Windows Media Feature Pack is installed.</span>
        </div>
      </div>

      <div v-if="hasAlerts" class="legend">
        <p>
          <strong class="text-warning-400"><font-awesome-icon icon="exclamation-triangle" /></strong> = It could cause problems.
        </p>

        <p>
          <strong class="text-danger-400"><font-awesome-icon icon="exclamation-triangle" /></strong> = It will cause problems.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { requirements } from '~/modules/system'

const { is } = $provider.util

export default {
  data: () => ({
    requirements,
    is,
  }),

  computed: {
    hasAlerts() {
      return requirements.hasAlerts
    },
  },
}
</script>

<style lang="scss" scoped>
.alerts {
  .legend {
    @apply text-sm mt-6;
  }
}
</style>

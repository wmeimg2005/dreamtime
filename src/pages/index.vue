<template>
  <div class="home content-body">
    <!-- Global alert -->
    <div v-if="alert" class="notification" v-html="alert" />

    <!-- Update alert -->
    <div v-if="dreamtimeUpdater.available" class="notification notification--warning cursor-pointer" @click="$router.push('/about')">
      🎉 {{ $dream.name }} {{ dreamtimeUpdater.latest.tag_name }} is available for download, update now!
    </div>

    <!-- Quick Upload -->
    <nudify-upload />
  </div>
</template>

<script>
import { nucleus } from '~/modules/services'
import { dreamtime as dreamtimeUpdater } from '~/modules/updater'

export default {
  data: () => ({
    dreamtimeUpdater,
  }),

  computed: {
    alert() {
      return nucleus.alerts?.index
    },
  },
}
</script>

<style lang="scss" scoped>
.home {

}
</style>

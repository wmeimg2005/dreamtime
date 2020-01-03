<template>
  <div class="home content-body">
    <!-- Global alert -->
    <div v-if="alert" class="notification" v-html="alert" />

    <!-- DreamTime Updater -->
    <div v-if="dreamtime.available" class="notification notification--warning cursor-pointer" @click="$router.push('/wizard/dreamtime')">
      🎉 {{ $dream.name }} {{ dreamtime.latest.tag_name }} is available for download!
    </div>

    <!-- DreamPower Updater -->
    <div v-if="dreampower.available" class="notification notification--warning cursor-pointer" @click="$router.push('/wizard/power')">
      🎉 {{ dreampower.displayName }} {{ dreampower.latest.tag_name }} is available for download!
    </div>

    <!-- Checkpoints Updater -->
    <div v-if="checkpoints.available" class="notification notification--warning cursor-pointer" @click="$router.push('/wizard/checkpoints')">
      🎉 {{ checkpoints.displayName }} {{ checkpoints.latest.tag_name }} is available for download!
    </div>

    <!-- Quick Upload -->
    <nudify-upload />
  </div>
</template>

<script>
import { nucleus } from '~/modules/services'
import { dreamtime, dreampower, checkpoints } from '~/modules/updater'

export default {
  data: () => ({
    dreamtime,
    dreampower,
    checkpoints,
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

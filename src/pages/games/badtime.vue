<template>
  <div class="badtime">
    <iframe
      id="badtime"
      src="https://badtime.dreamnet.tech"
      name="badtime"
      scrolling="no"
      frameborder="0"
      marginheight="0px"
      marginwidth="0px"
      sandbox="allow-scripts allow-same-origin" />
  </div>
</template>

<script>
import { events, tutorial } from '~/modules'

export default {
  mounted() {
    this.unlock()
    tutorial.badtime()
  },

  methods: {
    unlock() {
      tutorial.badtime()
      events.emit('achievements.badtime')
    },
  },
}
</script>

<style lang="scss" scoped>
.badtime {
  @apply h-full;

  iframe {
    @apply border-none w-full h-full;
  }
}
</style>

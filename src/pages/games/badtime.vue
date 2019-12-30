<template>
  <div class="badtime">
    <iframe
      src="https://badtime.dreamnet.tech"
      name="badtime"
      scrolling="no"
      frameborder="0"
      marginheight="0px"
      marginwidth="0px"
      allowfullscreen />
  </div>
</template>

<script>
export default {
  mounted() {
    consola.track('BADTIME')
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

<template>
  <div class="home">
    <app-title>
      <h1 class="title">
        📷 Welcome to private entertainment
      </h1>

      <h3 class="subtitle">
        #freedom #opensource #rule34
      </h3>
    </app-title>

    <div class="content-body">
      <!-- Quick Upload -->
      <nudity-upload />
    </div>
  </div>
</template>

<script>
import path from 'path'

export default {
  data: () => ({}),

  created() {}
}
</script>

<style lang="scss">
.home {
  .home-wip {
    @apply flex flex-col justify-center items-center;

    a {
      @apply text-primary underline;
    }
  }
}
</style>

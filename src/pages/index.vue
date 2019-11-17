<template>
  <div class="home">
    <app-title>
      <h1 class="title">
        📷 Nudify: It's {{ $dream.name }}
      </h1>

      <h3 class="subtitle">
        Select a photo and have a good dream
      </h3>
    </app-title>

    <div class="content-body">
      <div v-if="alert" class="notification is-warning" v-html="alert" />

      <!-- Quick Upload -->
      <nudity-upload />
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({}),

  computed: {
    alert() {
      return $nucleus.isEnabled ? $nucleus.alerts.index : undefined
    },
  },

  created() {},
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

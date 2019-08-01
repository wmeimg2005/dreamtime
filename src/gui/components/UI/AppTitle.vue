<template>
  <div class="app-title">
    <slot />
  </div>
</template>

<style lang="scss">
.app-title {
  @apply px-4 py-2 bg-dark shadow flex flex-col justify-center;
  height: 90px;

  .title {
    @apply font-bold text-generic-600 text-xl;

    sup {
      @apply text-white;
    }
  }

  .subtitle {
    @apply text-lg;
  }

  a {
    @apply underline;
  }
}
</style>

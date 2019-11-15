<template>
  <div class="app-title">
    <slot />
  </div>
</template>

<style lang="scss">
.app-title {
  @apply px-4 py-2 bg-dark-500 shadow flex flex-col justify-center;
  height: 70px;

  .title {
    @apply font-bold text-white text-lg;

    sup {
      @apply text-white;
    }
  }

  .subtitle {
    @apply text-generic-300;
  }

  a {
    @apply underline;
  }
}
</style>

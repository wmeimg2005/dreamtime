<template>
  <div class="c-title">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.c-title {
  @apply px-4 bg-dark-500 shadow-lg flex items-center;
  position: sticky;
  top: 0;
  height: 50px;

  .title {
    @apply text-base text-white font-bold pr-2 mr-2;
    @apply border-r border-dark-100;

    sup {
      @apply text-white;
    }
  }

  .subtitle {
    @apply text-gray-400 text-sm;
  }

  a {
    @apply underline;
  }
}
</style>

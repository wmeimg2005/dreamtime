<template>
  <div class="header">
    <div class="header__left">
      <slot />
    </div>

    <div v-if="this.$slots.center" class="header__center">
      <slot name="center" />
    </div>

    <div v-if="this.$slots.right" class="header__right">
      <slot name="right" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  @apply flex mb-9;
}

.header__left {
  @apply flex-1;

  &:not(:last-child) {
    @apply mr-3;
  }
}

.title {
  @apply text-lg font-semibold text-generic-100;

  .icon {
    @apply mr-2;
  }
}

.subtitle {
  @apply font-thin;

  .help {
    @apply ml-2;
    cursor: help;
  }
}
</style>

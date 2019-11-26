<template>
  <div class="layout__navbar">
    <div class="navbar__left">
      <nuxt-link v-if="$provider.tools.system.canNudify" to="/" class="navbar__item">
        Nudify
      </nuxt-link>

      <nuxt-link class="navbar__item" to="/about">
        About
      </nuxt-link>

      <nuxt-link class="navbar__item" to="/dreamnet">
        DreamNet
      </nuxt-link>
    </div>

    <div class="navbar__right">
      <nuxt-link v-tooltip="{placement: 'bottom', content: 'Settings'}" class="navbar__icon" to="/settings">
        <font-awesome-icon icon="cog" />
      </nuxt-link>

      <nuxt-link v-if="false" v-tooltip="{placement: 'bottom', content: 'About'}" class="navbar__icon" to="/about">
        <font-awesome-icon icon="info-circle" />
      </nuxt-link>

      <nuxt-link v-if="false" v-tooltip="{placement: 'bottom', content: 'DreamNet'}" class="navbar__icon" to="/dreamnet">
        <font-awesome-icon icon="code" />
      </nuxt-link>

      <nuxt-link v-tooltip="{placement: 'bottom', content: 'Donate'}" class="navbar__icon" to="/donate">
        <font-awesome-icon icon="donate" />
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.layout__navbar {
  @apply flex bg-dark-500 shadow-lg z-10;
  height: 50px;

  .navbar__left,
  .navbar__right {
    @apply flex-1 flex items-center;
  }

  .navbar__right {
    @apply justify-end;
  }

  .navbar__item {
    @apply mx-6 text-sm uppercase font-bold;

    &:hover {
      @apply text-white;
    }
  }

  .navbar__icon {
    @apply mx-4;

    &:hover {
      @apply text-white;
    }
  }
}
</style>

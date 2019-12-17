<template>
  <div class="layout__navbar">
    <div class="navbar__left">
      <nuxt-link v-if="canNudify" to="/" class="navbar__item">
        Nudify
      </nuxt-link>

      <nuxt-link class="navbar__item" to="/about">
        About
      </nuxt-link>

      <nuxt-link v-if="canNudify" class="navbar__item" to="/dreamnet">
        DreamNet
      </nuxt-link>

      <a class="navbar__item" @click.prevent="createError">
        Error
      </a>
    </div>

    <div class="navbar__right">
      <nuxt-link v-tooltip="{placement: 'bottom', content: 'Settings'}" class="navbar__icon" to="/settings">
        <font-awesome-icon icon="cog" />
      </nuxt-link>

      <a v-tooltip="{placement: 'bottom', content: 'Donate and get benefits!'}" class="navbar__icon" :href="donateUrl" target="_blank">
        <font-awesome-icon :icon="['fab', 'patreon']" />
      </a>

      <a v-tooltip="{placement: 'bottom', content: 'Manual'}" class="navbar__icon" :href="manualURL" target="_blank">
        <font-awesome-icon icon="question-circle" />
      </a>
    </div>
  </div>
</template>

<script>
import { requirements } from '~/modules/system'
import { nucleus } from '~/modules/services'

export default {
  computed: {
    canNudify() {
      return requirements.canNudify
    },

    donateUrl() {
      return nucleus.urls?.support?.patreon || 'https://www.patreon.com/dreamnet'
    },

    manualURL() {
      return nucleus.urls?.docs?.manual || 'https://forum.dreamnet.tech/d/32-dreamtime-manual'
    },
  },

  methods: {
    createError() {
      throw new Error('User Interface test error.')
    },
  },
}
</script>

<style lang="scss" scoped>
.layout__navbar {
  @apply flex bg-dark-500 z-10;
  @apply border-b border-dark-300;
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

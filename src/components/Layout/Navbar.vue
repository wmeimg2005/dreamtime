<template>
  <div class="layout__navbar">
    <div class="navbar__left">
      <nuxt-link v-if="canNudify" to="/" class="navbar__item">
        Nudify
      </nuxt-link>

      <nuxt-link id="settings" class="navbar__item" to="/settings">
        Settings
      </nuxt-link>

      <a id="guide" class="navbar__item" :href="manualURL" target="_blank">
        Help
      </a>

      <nuxt-link v-if="unlockedBadTime" class="navbar__item" to="/games/badtime">
        Bad Time
      </nuxt-link>

      <a v-if="isDev" class="navbar__item" @click.prevent="createError">
        Force Error
      </a>

      <a v-if="isDev" href="https://google.com" class="navbar__item">
        External Page
      </a>

      <a v-if="isDev" href="https://google.com" target="_blank" class="navbar__item">
        Popup
      </a>
    </div>

    <div class="navbar__right">
      <nuxt-link v-tooltip="{placement: 'bottom', content: 'About'}" class="navbar__icon" to="/about">
        <font-awesome-icon icon="info-circle" />
      </nuxt-link>

      <nuxt-link v-tooltip="{placement: 'bottom', content: 'DreamNet'}" class="navbar__icon" to="/dreamnet">
        <font-awesome-icon icon="users" />
      </nuxt-link>

      <a v-tooltip="{placement: 'bottom', content: 'Donate and get benefits!'}" class="navbar__icon" :href="donateUrl" target="_blank">
        <font-awesome-icon :icon="['fab', 'patreon']" />
      </a>
    </div>
  </div>
</template>

<script>
import { requirements, settings } from '~/modules/system'
import { nucleus } from '~/modules/services'
import { events } from '~/modules'

export default {
  data: () => ({
    unlockedBadTime: settings.achievements.badtime,
  }),

  computed: {
    canNudify() {
      return requirements.canNudify
    },

    donateUrl() {
      return nucleus.urls?.support?.patreon || 'https://www.patreon.com/dreamnet'
    },

    manualURL() {
      return nucleus.urls?.docs?.manual || 'https://time.dreamnet.tech/docs/guide/upload'
    },

    isDev() {
      return process.env.name === 'development'
    },
  },

  mounted() {
    events.on('achievements.badtime', () => {
      this.unlockedBadTime = true
    })
  },

  methods: {
    createError() {
      throw new Error('UI TEST ERROR')
    },
  },
}
</script>

<style lang="scss" scoped>
.layout__navbar {
  @apply flex bg-dark-500 z-10;
  @apply border-b border-dark-100;
  height: 50px;

  .navbar__left,
  .navbar__right {
    @apply flex items-center;
  }

  .navbar__left {
    @apply flex-1 mr-2;
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

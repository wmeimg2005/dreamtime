<template>
  <div class="layout__navbar">
    <div class="navbar__left">
      <nuxt-link v-if="canNudify" to="/" class="navbar__item navbar__item--home">
        Upload
      </nuxt-link>

      <nuxt-link id="settings" class="navbar__item" to="/settings">
        Settings
      </nuxt-link>

      <nuxt-link v-if="unlockedBadTime" v-tooltip="{ content: 'Mini-game. Can you survive until the end? 🎮💀', placement: 'bottom' }" class="navbar__item" to="/games/badtime">
        Bad Time Game
      </nuxt-link>

      <a v-if="isDev" class="navbar__item" @click.prevent="createError">
        Force Error
      </a>
    </div>

    <div class="navbar__right">
      <nuxt-link v-tooltip="{placement: 'bottom', content: 'Alert Center'}" class="navbar__icon" to="/alerts">
        <font-awesome-icon v-if="hasAlerts" icon="exclamation-triangle" class="alerts--active" />
        <font-awesome-icon v-else icon="check-circle" class="alerts--ok" />
      </nuxt-link>

      <nuxt-link v-tooltip="{placement: 'bottom', content: 'About'}" class="navbar__icon" to="/about">
        <font-awesome-icon icon="info-circle" />
      </nuxt-link>

      <nuxt-link
        v-if="$provider.system.online"
        v-tooltip="{placement: 'bottom', content: 'DreamNet'}"
        class="navbar__icon"
        to="/dreamnet">
        <font-awesome-icon icon="users" />
      </nuxt-link>

      <a
        v-if="$provider.system.online"
        id="guide"
        v-tooltip="{placement: 'bottom', content: 'User\'s Guide.'}"
        class="navbar__icon"
        :href="manualURL"
        target="_blank">
        <font-awesome-icon icon="question-circle" />
      </a>

      <a
        v-if="$provider.system.online"
        v-tooltip="{placement: 'bottom', content: 'Donate and get benefits!'}"
        class="navbar__icon"
        :href="donateUrl"
        target="_blank">
        <font-awesome-icon :icon="['fab', 'patreon']" />
      </a>
    </div>
  </div>
</template>

<script>
import { requirements, settings } from '~/modules/system'
import { dreamtrack } from '~/modules/services'
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
      return dreamtrack.get('urls.support.patreon', 'https://www.patreon.com/dreamnet')
    },

    manualURL() {
      return dreamtrack.get('urls.docs.manual', 'https://time.dreamnet.tech/docs/guide/upload')
    },

    isDev() {
      return process.env.NODE_ENV === 'development'
    },

    hasAlerts() {
      return requirements.hasAlerts
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
@keyframes alertAnim {
  0% {
    @apply text-danger-500;
  }
  50% {
    @apply text-warning-500;
  }
  100% {
    @apply text-danger-500;
  }
}

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

    &:not(.navbar__item--home) {
      &.nuxt-link-active {
        @apply text-primary-500;
      }
    }

    &.navbar__item--home {
      &.nuxt-link-exact-active {
        @apply text-primary-500;
      }
    }
  }

  .navbar__icon {
    @apply mx-4;

    &:hover {
      @apply text-white;
    }

    &.nuxt-link-active {
      @apply text-primary-500;
    }
  }
}

.alerts--active {
  animation-name: alertAnim;
  animation-iteration-count: infinite;
  animation-duration: 3s;
  animation-timing-function: ease-in-out;
}

.alerts--ok {
  @apply text-success-500;
}
</style>

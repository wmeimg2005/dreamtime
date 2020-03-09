<template>
  <div class="nav">
    <div class="nav__left">
      <div v-tooltip="$dream.version"
           class="nav__item nav__item--logo">
        <span>{{ $dream.name }}</span>
      </div>

      <div class="nav__item nav__item--greetings">
        <span v-if="!isBadTime">{{ greetings }}</span>
        <span v-else><img src="~/assets/images/games/sans.png"> i don't like what you are doing.</span>
      </div>
    </div>

    <div class="nav__center">
      <nuxt-link v-tooltip="'Upload'"
                 to="/"
                 class="nav__item nav__item--link">
        <font-awesome-icon icon="upload" />
      </nuxt-link>

      <div v-tooltip="'My panel'"
           class="nav__item nav__item--link">
        <img :src="avatar"
             alt="Me">
      </div>

      <div v-tooltip="'Advanced Mode'"
           class="nav__item nav__item--link">
        <font-awesome-icon icon="mask" />
      </div>
    </div>

    <div class="nav__right">
      <div v-if="isBadTimeAvailable"
           v-tooltip="'Bad Time Game'"
           class="nav__item nav__item--button">
        <img src="~/assets/images/games/sans.png">
      </div>

      <nuxt-link v-tooltip="'Settings'"
                 to="/settings"
                 class="nav__item nav__item--button">
        <font-awesome-icon icon="cog" />
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import Avatars from '@dicebear/avatars'
import sprites from '@dicebear/avatars-jdenticon-sprites'
import { requirements, settings } from '~/modules/system'
import { dreamtrack } from '~/modules/services'
import { events } from '~/modules'

export default {
  data: () => ({
    isBadTimeAvailable: settings.achievements.badtime,
    isBadTime: false,
  }),

  computed: {
    avatar() {
      const avatars = new Avatars(sprites, { base64: true })
      return avatars.create(settings.user)
    },

    greetings() {
      const hours = dayjs().hour()

      if (hours >= 6 && hours <= 11) {
        return '☕ Good morning'
      }

      if (hours >= 12 && hours <= 19) {
        return '🌞 Good afternoon'
      }

      if (hours >= 0 && hours <= 5) {
        return '🐏 Sweet dreams'
      }

      return '🌛 Good night'
    },

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
      this.isBadTimeAvailable = true
    })

    this.$router.afterEach((to) => {
      if (to.path === '/games/badtime') {
        this.$dream.name = 'BadDreamTime'
        this.isBadTime = true
      } else {
        this.$dream.name = process.env.npm_package_displayName
        this.isBadTime = false
      }
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
@keyframes logoAnim {
  0% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 0%;
  }
  100% {
    background-position: 0% 0%;
  }
}

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

.nav {
  @apply flex z-10;
  @apply h-full bg-dark-500 border-b-2 border-dark-600 shadow;
  grid-area: nav;

  .nav__left,
  .nav__center,
  .nav__right {
    @apply flex-1 flex;
  }

  .nav__left {
    @apply flex-1;
  }

  .nav__center {
    @apply justify-center;
  }

  .nav__right {
    @apply justify-end items-center;
  }
}

.nav__item {
  @apply flex items-center;

  img {
    @apply rounded-full;
    height: 30px;
  }

  &.nav__item--link {
    @apply justify-center;
    @apply border-b-2 border-transparent text-lg;
    width: 100px;

    &:hover {
      @apply text-primary-500 border-primary-500;
    }
  }

  &.nav__item--button {
    @apply justify-center;
    @apply rounded-full text-lg mr-3;
    width: 40px;
    height: 40px;

    &:hover {
      @apply bg-dark-800;
    }

    img {
    height: 20px;
  }
  }

  &.nav__item--logo {
    @apply text-white text-sm font-bold px-6 select-none;

    background: rgb(99, 66, 245);
    background: linear-gradient(
      40deg,
      rgba(99, 66, 245, 1) 0%,
      rgba(239, 125, 199, 1) 100%
    );
    background-size: 200% 100%;
    background-position: 0% 0%;

    animation-name: logoAnim;
    animation-iteration-count: infinite;
    animation-duration: 10s;
    animation-timing-function: ease-in-out;
  }

  &.nav__item--greetings {
    @apply text-white text-sm font-light px-3 select-none;
  }
}

.layout__navbar {
  @apply flex bg-dark-500 z-10;
  @apply border-b border-dark-100;
  grid-area: nav;
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

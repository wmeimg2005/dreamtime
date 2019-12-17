<template>
  <div class="layout-menu">
    <div :class="{ 'is-active': isActive }" class="navbar">
      <!-- App Navigation -->
      <section class="menu-section">
        <nav class="menu-items">
          <nuxt-link v-if="canNudify" to="/" class="menu-item">
            <span class="icon">📷</span>
            <span>Nudify</span>
          </nuxt-link>

          <nuxt-link to="/system/about" class="menu-item">
            <span class="icon">🌌</span>
            <span>About</span>
          </nuxt-link>

          <nuxt-link to="/system/settings/processing" class="menu-item">
            <span class="icon">🔧</span>
            <span>Settings</span>
          </nuxt-link>
        </nav>
      </section>

      <!-- Developer Navigation -->
      <section v-if="isDev" class="menu-section">
        <nav class="menu-items" />
      </section>
    </div>
  </div>
</template>

<script>
import { requirements } from '~/modules/system'

const { settings } = $provider

export default {
  computed: {
    canNudify() {
      return requirements.canNudify
    },

    isDev() {
      return process.env.NODE_ENV === 'development'
    },

    isActive() {
      // eslint-disable-next-line no-underscore-dangle
      return settings.welcome !== true
    },
  },

  methods: {
    testBug() {
      throw new Error('wow much error')
    },
  },
}
</script>

<style lang="scss" scoped>
@keyframes navShowAnim {
  0% {
    left: -200px;
  }

  100% {
    left: 0;
  }
}

.layout-menu {
  @apply pb-6 shadow h-screen bg-dark-500 relative;
  @apply border-r border-dark-300;
  width: 200px;

  .menu {
    @apply absolute top-0 bottom-0;
    left: -200px;
    width: inherit;

    &.is-active {
      animation-name: navShowAnim;
      animation-fill-mode: forwards;
      animation-duration: 0.5s;
      animation-timing-function: ease-in-out;
    }
  }

  .menu-header {
    @apply mb-4 text-gray-300 flex flex-col items-center justify-center;
    animation: 20s ease-in-out infinite bgAnim;
    height: 70px;

    background: rgb(99, 66, 245);

    background: linear-gradient(
      40deg,
      rgba(99, 66, 245, 1) 0%,
      rgba(239, 125, 199, 1) 100%
    );

    background-size: 200% 100%;

    /*
    clip-path: polygon(
      50% 0%,
      100% 0,
      100% 85%,
      75% 100%,
      25% 100%,
      0 85%,
      0 0
    );
    */

    .header-title {
      @apply text-white text-xl font-bold;
    }

    .header-greetings {
      @apply text-sm;
    }
  }

  .menu-section {
    @apply mb-4;
  }

  .section-title {
    @apply text-center font-bold;
  }

  .menu-items {
    .menu-item {
      @apply border-l-4 border-transparent pl-4 font-semibold flex items-center;
      height: 50px;
      transition: all 0.1s ease-in-out;

      .icon {
        @apply text-center mr-2;
        filter: grayscale(100%);
        width: 22px;
        transition: all 0.1s ease-in-out;
      }

      &:hover,
      &.nuxt-link-exact-active {
        @apply text-primary-500 border-primary-500;

        .icon {
          filter: unset;
        }
      }
    }
  }
}
</style>

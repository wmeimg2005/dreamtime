<template>
  <div class="layout__topbar">
    <div class="topbar__left">
      <div class="topbar__logo">
        {{ $dream.name }} {{ $dream.version }}
      </div>

      <div v-show="!badTime" class="topbar__greetings">
        {{ greetings }}
      </div>

      <div v-show="badTime" class="topbar__badtime">
        <img src="~/assets/images/games/sans.png">
        i don't like what you are doing.
      </div>
    </div>

    <div class="topbar__buttons">
      <button id="minimize" type="button" @click="minimize">
        <font-awesome-icon icon="minus" />
      </button>

      <button id="maximize" type="button" @click="maximize">
        <font-awesome-icon :icon="['far', 'square']" />
      </button>

      <button id="close" type="button" class="close" @click="close">
        <font-awesome-icon icon="times" />
      </button>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'

const { getCurrentWindow } = require('electron').remote

const { api } = $provider.util

export default {
  data: () => ({
    badTime: false,
  }),

  computed: {
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
  },

  mounted() {
    this.$router.afterEach((to) => {
      if (to.path === '/games/badtime') {
        this.$dream.name = 'BadDreamTime'
        this.badTime = true
      } else {
        this.$dream.name = process.env.npm_package_displayName
        this.badTime = false
      }
    })
  },

  methods: {
    minimize() {
      try {
        getCurrentWindow().minimize()
      } catch (error) {
        throw new Exception('There was a problem trying to minimize the window.', error)
      }
    },

    maximize() {
      try {
        getCurrentWindow().maximize()
      } catch (error) {
        throw new Exception('There was a problem trying to maximize the window.', error)
      }
    },

    close() {
      api.app.quit()
    },
  },
}
</script>

<style lang="scss" scoped>
@keyframes bgAnim {
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

.layout__topbar {
  @apply flex bg-black text-white;
  height: 30px;
  z-index: 9999999;

  .topbar__left {
    @apply flex-1 flex;
    @apply text-sm;
    -webkit-app-region: drag;
  }

  .topbar__logo {
    @apply flex flex-col items-center justify-center mr-4;
    @apply font-bold px-4;
    background: rgb(99, 66, 245);

    background: linear-gradient(
      40deg,
      rgba(99, 66, 245, 1) 0%,
      rgba(239, 125, 199, 1) 100%
    );

    background-size: 200% 100%;

    animation-name: bgAnim;
    animation-iteration-count: infinite;
    animation-duration: 10s;
    animation-timing-function: ease-in-out;
  }

  .topbar__greetings {
    @apply flex items-center justify-center;
    @apply font-light;
  }

  .topbar__badtime {
    @apply flex items-center justify-center;
    @apply lowercase font-bold text-sm;
    font-family: "Comic Sans MS", serif;

    img {
      @apply mr-2;
      height: 18px;
    }
  }

  .topbar__buttons {
    @apply flex;

    button {
      @apply flex items-center justify-center outline-none;
      @apply text-xs;
      width: 50px;
      height: 30px;

      &:hover {
        @apply bg-gray-700;

        &.close {
          @apply bg-danger-500;
        }
      }
    }
  }
}
</style>

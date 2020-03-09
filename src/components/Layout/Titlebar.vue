<template>
  <div class="titlebar">
    <div class="titlebar__drag" />

    <div class="titlebar__buttons">
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
const { getCurrentWindow } = require('electron').remote

const { api } = $provider.util

export default {
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


.titlebar {
  @apply flex justify-end;
  @apply bg-black text-white;
  grid-area: title;
  height: 30px;
  z-index: 9999999;

  .topbar__badtime {
    @apply flex items-center justify-center;
    @apply lowercase font-bold text-sm;
    font-family: "Comic Sans MS", serif;

    img {
      @apply mr-2;
      height: 18px;
    }
  }

  .titlebar__drag {
    @apply flex-1;
    -webkit-app-region: drag;
  }

  .titlebar__buttons {
    @apply flex;

    button {
      @apply flex items-center justify-center outline-none;
      @apply text-xs;
      width: 50px;
      height: 30px;

      &:hover {
        @apply bg-dark-800;

        &.close {
          @apply bg-danger-500;
        }
      }
    }
  }
}
</style>

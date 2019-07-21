<template>
  <div class="layout-navbar">
    <!-- Welcome! -->
    <section class="navbar-section">
      <h3 class="section-title">
        {{ greetings }}
      </h3>
    </section>

    <section class="navbar-section">
      <nav class="navbar-items">
        <nuxt-link to="/" class="navbar-item">
          <span class="icon">🏠</span>
          <span>Home</span>
        </nuxt-link>

        <!--
        <nuxt-link to="/models" class="navbar-item">
          🎭 Models
        </nuxt-link>
        -->

        <!--
        <nuxt-link to="/nudity/transform" class="navbar-item">
          ⚡ Quick transform
        </nuxt-link>
        -->

        <nuxt-link to="/update" class="navbar-item">
          <span class="icon">🌎</span>
          <span>Updates</span>
        </nuxt-link>

        <nuxt-link to="/about" class="navbar-item">
          <span class="icon">❓</span>
          <span>About</span>
        </nuxt-link>

        <nuxt-link to="/settings" class="navbar-item">
          <span class="icon">🔧</span>
          <span>Settings</span>
        </nuxt-link>
      </nav>
    </section>

    <section class="navbar-section">
      <nav class="navbar-items">
        <a href="#" class="navbar-item" @click.prevent="$data.$deepTools.shell.openExternal('https://www.patreon.com/deepmanyy')">
          <span class="icon">💖</span>
          <span>Patreon</span>
        </a>

        <a href="#" class="navbar-item" @click.prevent="$data.$deepTools.shell.openExternal('https://discord.gg/RjBSaND')">
          <span class="icon">🤟</span>
          <span>Discord</span>
        </a>
      </nav>
    </section>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  computed: {
    greetings() {
      const hours = moment().hours()

      if (hours >= 6 && hours <= 11) {
        return 'Good morning ☕'
      }

      if (hours >= 12 && hours <= 19) {
        return 'Good afternoon 🌞'
      }

      return 'Good night 🌛'
    }
  }
}
</script>


<style lang="scss">
.layout-navbar {
  @apply py-6 shadow h-screen;
  width: 200px;

  .navbar-section {
    @apply mb-5;
  }

  .section-title {
    @apply text-center font-bold;
  }

  .navbar-items {
    .navbar-item {
      @apply flex items-center text-gray-700 border-l-4 border-transparent pl-4;
      height: 50px;
      transition: all 0.15s ease-in-out;

      .icon {
        @apply text-center mr-2;
        width: 22px;
      }

      &:hover {
        @apply text-black bg-gray-100 border-primary;
      }
    }
  }
}
</style>

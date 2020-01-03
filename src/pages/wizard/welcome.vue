<template>
  <div ref="intro" class="welcome">
    <h1 class="welcome__title">
      Welcome to {{ $dream.name }}!
    </h1>

    <h2 class="welcome__subtitle">
      Thanks for installing.
    </h2>

    <h2 class="welcome__message">
      We will take a few minutes of your time to prepare the dream machine.<br>It will be worth it, we promise.
    </h2>

    <button class="button button--xl" @click.prevent="next">
      Continue
    </button>
  </div>
</template>

<script>
import { tween, styler } from 'popmotion'

export default {
  layout: 'wizard',

  mounted() {
    setTimeout(() => {
      const intro = styler(this.$refs.intro)

      tween({
        from: { opacity: 0 },
        to: { opacity: 1 },
        duration: 2500,
      }).start((v) => intro.set(v))
    }, 1000)
  },

  methods: {
    next() {
      this.$settings.wizard.welcome = true
      this.$router.push('/wizard/tos')
    },
  },
}
</script>

<style lang="scss" scoped>
.welcome {
  @apply opacity-0 h-full;
  @apply flex flex-col justify-center items-center;
}

.welcome__title {
  @apply text-6xl text-white font-bold;
}

.welcome__subtitle {
  @apply text-4xl font-semibold;
}

.welcome__message {
  @apply text-xl my-10 text-center;
}
</style>

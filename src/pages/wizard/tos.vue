<template>
  <div class="tos">
    <div class="layout__header">
      <h1 class="title">
        <font-awesome-icon icon="magic" /> Setup Wizard
      </h1>

      <h2 class="subtitle">
        Important information.
      </h2>
    </div>

    <ul>
      <li>
        <figure><font-awesome-icon icon="user-slash" /></figure>
        <p>
          <strong>{{ $dream.name }} is an application for adults.</strong>
          <span>If you are not of legal age, please close and uninstall the application.</span>
        </p>
      </li>

      <li>
        <figure><font-awesome-icon icon="gift" /></figure>
        <p>
          <strong>{{ $dream.name }} is completely free and open-source.</strong>
          <span>Do not pay for it or download premium versions or cracks. Please do not let others fall into SCAMs or malware.</span>
        </p>
      </li>

      <li>
        <figure><font-awesome-icon icon="ban" /></figure>
        <p>
          <strong>Do not use {{ $dream.name }} to harm people.</strong>
          <span>The application is intended exclusively for <b>private use</b>, do not share the photos you create to harm people.</span>
          <span>Doing so damages the development of this technology that could be used for other positive purposes.</span>
        </p>
      </li>

      <li>
        <figure><font-awesome-icon icon="file-signature" /></figure>
        <p>
          <strong>DreamTime is under the GPL-3.0</strong>
          <span>TL;DR: You can modify the application code and share it, but always under the same license and you must share the source code of your modifications.</span>
        </p>
      </li>

      <li>
        <figure><font-awesome-icon icon="heart" /></figure>
        <p>
          <strong>If you like DreamTime consider supporting us.</strong>
          <span>You can find our Patreon and other forms of support on our website or the "About" section when you finish preparing the application.</span>
          <span>By supporting us, you allow us to continue improving the app and release updates sooner.</span>
        </p>
      </li>
    </ul>

    <div class="text-center">
      <button class="button button--xl" @click.prevent="next">
        Understood
      </button>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'wizard',

  methods: {
    next() {
      this.$settings.wizard.tos = true
      this.$router.push('/wizard/power')
    },
  },
}
</script>

<style lang="scss" scoped>
.tos {
  ul {
    li {
      @apply mb-10 flex items-center;

      figure {
        @apply text-5xl mr-6;
      }

      strong {
        @apply block text-3xl text-white;
      }

      span {
        @apply block text-xl;
      }
    }
  }
}
</style>

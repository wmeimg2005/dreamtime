<template>
  <a href="#" class="c-app-external-link" @click.prevent="openExternal">
    <slot />
  </a>
</template>

<script>
const { shell } = $provider.api

export default {
  props: {
    href: {
      type: String,
      required: true,
    },
  },

  methods: {
    openExternal() {
      $provider.services.nucleus.track('EXTERNAL_LINK', { href: this.href })
      shell.openExternal(this.href)
    },
  },
}
</script>

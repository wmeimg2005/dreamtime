<template>
  <a href="#" class="c-app-external-link" @click.prevent="openExternal">
    <slot />
  </a>
</template>

<script>
import { api } from 'electron-utils'

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
      api.shell.openExternal(this.href)
    },
  },
}
</script>

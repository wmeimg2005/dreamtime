<template>
  <!-- Cannot update, only show the version... -->
  <box-item
    v-if="!updater.enabled"
    v-tooltip="{ content: 'Installed version', placement: 'bottom' }"
    :label="currentVersion"
    icon="rocket" />

  <!-- Updated! -->
  <box-item
    v-else-if="!updater.available"
    :label="`${projectTitle} is up to date.`"
    :description="currentVersion"
    icon="rocket" />

  <!-- Update available -->
  <box-item
    v-else
    :label="`${projectTitle} ${updater.latest.tag_name} available.`"
    icon="fire-alt"
    class="update-item"
    :is-link="true"
    @click="next" />
</template>

<script>
/* eslint import/namespace: ['error', { allowComputed: true }] */
import * as providers from '~/modules/updater'

export default {
  props: {
    project: {
      type: String,
      required: true,
    },

    projectTitle: {
      type: String,
      default: 'Project',
    },

    href: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    updater: {},
  }),

  computed: {
    currentVersion() {
      return this.updater?.currentVersion || 'v0.0.0'
    },
  },

  created() {
    this.updater = providers[this.project]
  },

  methods: {
    next() {
      this.$router.push(this.href)
    },
  },
}
</script>

<style lang="scss">
@keyframes updateAnim {
  0% {
    @apply bg-transparent;
  }

  50% {
    @apply bg-dark-100;
  }

  100% {
    @apply bg-transparent;
  }
}

.update-item {
  transition: all 0.2s ease-in-out;
  animation-name: updateAnim;
  animation-duration: 2s;
  animation-iteration-count: infinite;

  &:hover {
    animation-name: none;
    background: theme('colors.dark.300') !important;
  }

  .item__label {
    @apply text-white;
  }

  .item__description {
    @apply text-generic-600;
  }
}
</style>

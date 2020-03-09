<template>
  <div class="item"
       :class="cssClass"
       @click="click">
    <!-- Icon -->
    <slot name="icon">
      <div v-if="icon"
           class="item__icon">
        <img v-if="isImageIcon"
             :src="icon">
        <font-awesome-icon v-else
                           :icon="icon" />
      </div>
    </slot>

    <!-- Title & Description -->
    <div v-if="label"
         class="item__label">
      <span class="item__title"
            v-html="label" />

      <slot name="description">
        <span v-if="description"
              class="item__description"
              v-html="description" />
      </slot>
    </div>

    <!-- Action -->
    <div v-if="$slots.default"
         class="item__action">
      <slot />
    </div>
  </div>
</template>

<script>
import { isNil, startsWith } from 'lodash'
import { dreamtrack } from '~/modules/services'

const { shell } = $provider.api

export default {
  props: {
    icon: {
      type: [String, Array],
      default: undefined,
    },

    label: {
      type: String,
      default: undefined,
    },

    description: {
      type: String,
      default: undefined,
    },

    href: {
      type: String,
      default: undefined,
    },

    isLink: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    hasIcon() {
      return !isNil(this.icon) || !isNil(this.$slots.icon)
    },

    isImageIcon() {
      return startsWith(this.icon, 'http') || startsWith(this.icon, '/')
    },

    cssClass() {
      return {
        'item--link': !isNil(this.href) || this.isLink,
      }
    },
  },

  methods: {
    click() {
      this.$emit('click')

      if (!isNil(this.href)) {
        if (startsWith(this.href, '/')) {
          this.$router.push(this.href)
        } else {
          dreamtrack.track('CLICK_LINK', { href: this.href })
          shell.openExternal(this.href)
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.item {
  @apply flex p-3 rounded;
  @apply border-b border-t border-transparent;
  @include transition('background-color, color, border-color');
  min-height: 50px;

  &.item--active {
    @apply bg-dark-400 border-dark-800 text-white;

    .item__icon, .item__title {
      @apply text-generic-500;
    }
  }

  &.item--link {
    @apply cursor-pointer;

    &:hover {
      @apply bg-dark-400 border-dark-800 text-white;

      .item__icon, .item__title {
        @apply text-generic-500;
      }
    }
  }
}

.item__icon {
  @apply mr-2 flex items-center justify-center;
  @apply text-2xl text-generic-500;
  width: 42px;
  min-width: 42px;
}

.item__label {
  @apply flex-1 flex flex-col justify-center;
  @apply text-generic-500;

  &:not(:last-child) {
    @apply mr-6;
  }

  .item__title {
    @apply block font-semibold;
  }

  .item__description {
    @apply block text-sm text-generic-700;
  }
}

.item__action {
  @apply flex-1;
}
</style>

<template>
  <div class="box lesson"
       :class="{ 'lesson--small': small }"
       @click="$emit('click')">
    <div class="box__photo"
         :class="[`photo--${lesson.photo}`]" />

    <div class="box__header">
      <span class="title">{{ lesson.title }}</span>
    </div>

    <div class="box__content"
         v-html="content" />

    <div v-if="!small"
         class="box__footer text-center">
      <a v-for="(button,key) in lesson.buttons"
         :key="key"
         :href="button.href"
         target="_blank"
         class="button button--sm">
        {{ button.text }}
      </a>
    </div>
  </div>
</template>

<script>
import MarkdownIt from 'markdown-it'
import { truncate } from 'lodash'

const md = new MarkdownIt()

export default {
  props: {
    lesson: {
      type: Object,
      required: true,
    },

    small: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    content() {
      let content

      if (this.small) {
        content = this.lesson.summary || truncate(this.lesson.content, { length: 80 })
      } else {
        content = this.lesson.content
      }

      return md.render(content)
    },
  },
}
</script>

<style lang="scss" scoped>
.lesson {
  &::v-deep ul {
    @apply list-disc;

    li {
      @apply text-sm ml-3;
    }
  }
}

.lesson--small {
  .title {
    @apply text-sm;
  }

  .box__content {
    &::v-deep p {
      @apply text-xs #{!important};
    }
  }

  .box__photo {
    min-height: 80px !important;
  }
}

.box__photo {
  @apply bg-contain;

  &.photo--tips {
    background-color: #e0719e;
    background-image: url('~assets/images/undraw/undraw_depi_wexf.svg')
  }

  &.photo--drag {
    background-color: #778BB0;
    background-image: url('~assets/images/undraw/undraw_logic_4ocy.svg')
  }

  &.photo--settings {
    background-color: #46766B;
    background-image: url('~assets/images/undraw/undraw_personal_settings_kihd.svg')
  }
}

.box__content {
  @apply text-sm;
}
</style>

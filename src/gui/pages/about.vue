<template>
  <div class="about">
    <app-title>
      <h1 class="title">
        About {{ app.name }}
      </h1>

      <h3 class="subtitle">
        Information about the project
      </h3>
    </app-title>

    <div ref="body" class="content-body" v-html="aboutHtml">
    </div>
  </div>
</template>

<script>
import { markdown } from 'markdown'

export default {
  data: () => ({
    aboutHtml: ''
  }),

  created() {
    const content = require('raw-loader!~/assets/etc/ABOUT.md').default
    this.aboutHtml = markdown.toHTML(content)
  },

  mounted() {
    this.$nextTick(() => {
      const links = this.$refs.body.querySelectorAll('a')

      for (const el of links) {
        el.addEventListener('click', this.openLink)
      }
    })
  },

  methods: {
    openLink(e) {
      e.preventDefault()
      window.deepTools.shellOpenExternal(e.target.href)
    }
  }
}
</script>


<style lang="scss">
.about {
  .content-body {
    h2 {
      @apply text-2xl font-bold mb-2 mt-6;
    }

    p {
      @apply my-2;
    }

    ul {
      @apply list-disc ml-4;

      li {
        @apply mt-1;
      }
    }

    a {
      @apply text-primary;

      &:hover {
        @apply underline;
      }
    }
  }
}
</style>

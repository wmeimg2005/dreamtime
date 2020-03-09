<template>
  <div class="help">
    <PageHeader>
      <h2 class="title">
        <span class="icon"><font-awesome-icon icon="question-circle" /></span>
        <span>Help</span>
      </h2>

      <h3 class="subtitle">
        Tips and suggestions to use {{ $dream.name }}.
      </h3>
    </PageHeader>

    <div class="help__content">
      <div v-for="(lesson, index) in help.lessons"
           :key="index"
           class="column">
        <HelpLesson
          :lesson="lesson" />
      </div>
    </div>
  </div>
</template>

<script>
import { Help } from '~/modules'

export default {
  data: () => ({
    help: Help,
  }),
}
</script>

<style lang="scss" scoped>
.help__content {
  @apply flex flex-wrap;

  .column {
    @apply w-1/2 px-3 mb-6;
  }

  .lesson {
    @apply h-full;
  }
}
</style>

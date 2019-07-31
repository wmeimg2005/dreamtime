<template>
  <div class="home">
    <app-title>
      <h1 class="title">
        📷 Welcome to private entertainment
      </h1>

      <h3 class="subtitle">
        #freedom #opensource #rule34
      </h3>
    </app-title>

    <div class="content-body">
      <div class="notification is-transparent">
        <strong>Remember!</strong> {{ $_dream.name }} is an free and open-source project, <strong class="text-primary">do not pay for similar programs</strong>! The technology behind {{ $_dream.name }} must be free and open for everyone, the only thing we ask you in return is that you use the program privately, for demonstration or education reasons. Do not hurt other people.
      </div>
    </div>

    <div class="home-wip">
      <!-- Quick Upload -->
      <nudity-upload />

      <!-- CLI Dir
      <div v-if="!validCliDir" class="notification is-danger">
        <strong>❌ Hold on!</strong><br />
        We could not find the <strong>CLI</strong> folder!
        This can be caused by a corrupt installation, please make sure that the CLI folder exists in:
        <br><br>{{ cliDirPath }}<br><br>
        Join our Discord for more information.
      </div>-->

      <!-- Checkpoints CLI Dir
      <div v-if="!validCheckpointsDir" class="notification is-danger">
        <strong>❌ Hold on!</strong><br />
        We could not find the <strong>checkpoints</strong> folder!
        This folder is downloaded separately, please make sure that the checkpoints folder exists in:
        <br><br>{{ checkpointsDirPath }}<br><br>
        Join our Discord for more information.
      </div>
      -->
    </div>
  </div>
</template>

<script>
import path from 'path'

export default {
  data: () => ({}),

  created() {}
}
</script>

<style lang="scss">
.home {
  .home-wip {
    @apply flex flex-col justify-center items-center;

    a {
      @apply text-primary underline;
    }
  }
}
</style>

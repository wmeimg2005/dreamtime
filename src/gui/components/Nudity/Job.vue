<template>
  <div class="c-nudity-job">
    <div v-if="job.hasFinished" class="job-status box">
      <p class="status-title">{{ job.timer.duration }}s</p>

      <div class="buttons">
        <button class="button is-success" @click.prevent="save">Save</button>
        <button class="button is-danger is-sm" @click.prevent="remake">Remake</button>
      </div>
    </div>

    <div v-else-if="job.hasFailed" class="job-status box">
      <p class="status-title text-danger">FAIL!</p>
    </div>

    <div v-else-if="job.isLoading" class="job-status box">
      <p class="status-title">{{ job.timer.duration }}s</p>
      <p class="status-text">Processing...</p>
    </div>

    <div v-else class="job-status box">
      <p class="status-text">Pending</p>
    </div>

    <div class="job-photos">
      <app-photo v-if="job.hasFinished" :src="outputDataURL">Result</app-photo>
    </div>

    <div class="job-console">
      <li v-for="(item, index) in job.cli.lines" :key="index" :class="item.css">{{ item.text }}</li>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  props: {
    job: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    outputDataURL: undefined
  }),

  watch: {
    async 'job.hasFinished'(value) {
      if (value) {
        this.outputDataURL = await this.job.getFile().readAsDataURL()
      }
    }
  },

  methods: {
    save() {
      const savePath = $tools.shell.showSaveDialogSync({
        defaultPath: this.job.getFileName()
      })

      if (_.isNil(savePath)) {
        return
      }

      this.job.getFile().copy(savePath)
    },
    remake() {
      this.job.photo.remake(this.job.id)
    }
  }
}
</script>

<style lang="scss">
.c-nudity-job {
  @apply flex mb-8;
  min-height: 150px;

  .job-photos {
    @apply flex-1 inline-flex;
  }

  .job-status {
    @apply flex flex-col justify-center items-center mr-5 mb-0;
    width: 150px;

    .buttons {
      @apply flex flex-col justify-center items-center;
    }

    .status-title {
      @apply font-semibold text-xl text-generic-300;
    }

    .status-text {
      @apply text-sm;
    }
  }

  .job-console {
    @apply bg-black p-2 overflow-auto rounded;
    width: 200px;
    height: 150px;

    li {
      @apply font-mono text-xs text-generic-100 mb-2 block;
    }
  }
}
</style>

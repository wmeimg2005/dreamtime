<template>
  <div class="layout__jobs">
    <div class="jobs__section">
      <div class="section__title">
        <span class="icon"><font-awesome-icon icon="running" /></span>
        <span>Running</span>
      </div>
    </div>

    <div class="jobs__section">
      <div class="section__title">
        <div class="flex-1">
          <span class="icon"><font-awesome-icon icon="clipboard-list" /></span>
          <span>Pending</span>
        </div>

        <button class="button button--xs">
          Run all
        </button>
      </div>

      <div class="jobs__list">
        <div v-for="(photo, index) of pending" :key="index" class="job" @click.prevent="openJob(photo.id)">
          <figure class="job__preview">
            <img :src="photo.file.dataUrl">
          </figure>

          <span class="job__name">{{ photo.file.fullname }}</span>
        </div>
      </div>
    </div>

    <div class="jobs__section">
      <div class="section__title">
        <span class="icon"><font-awesome-icon icon="clipboard-check" /></span>
        <span>Done</span>
      </div>
    </div>
  </div>
</template>

<script>
import { events } from '~/modules'
import { Nudify } from '~/modules/nudify'

export default {
  data: () => ({
    running: [],
    pending: [],
    done: [],
  }),

  created() {
    events.on('nudify.add', () => {
      this.running = Nudify.running
      this.pending = Nudify.pending
      this.done = Nudify.done
    })
  },

  methods: {
    openJob(photoId) {
      this.$router.push(`/nudify/${photoId}`)
    },
  },
}
</script>

<style lang="scss" scoped>
.layout__jobs {
  @apply h-screen bg-dark-500;
  @apply flex flex-col;
  width: 200px;
}

.jobs__section {
  @apply flex-1 flex flex-col;
  @apply overflow-hidden;
}

.section__title {
  @apply px-4 pt-2 text-sm uppercase font-semibold;
  @apply flex items-center;

  .icon {
    @apply mr-2;
  }
}

.jobs__list {
  @apply flex-1 overflow-y-auto max-h-full;

  .job {
    @apply px-4 py-2 flex items-center cursor-pointer;
    transition: all .1s ease-in-out;

    &:hover {
      @apply bg-dark-300 text-white;
    }
  }

  .job__preview {
    @apply mr-4 h-full;
    width: 42px;

    img {
      width: 42px;
      height: 42px;
    }
  }

  .job__name {
    @apply flex-1 overflow-hidden whitespace-no-wrap;
    text-overflow: ellipsis;
  }
}

.layout-jobs {
  @apply p-2 shadow h-screen flex flex-col;
  width: 200px;

  .jobs-pending {
    @apply flex-1 border-b border-gray-300 mb-2;
  }

  .jobs-recent {
    height: 250px;
  }

  .job-section {
    @apply mb-4;
  }

  .section-title {
    @apply font-bold;
  }
}
</style>

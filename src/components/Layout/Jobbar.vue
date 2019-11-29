<template>
  <div class="layout__jobbar">
    <div class="jobs__section">
      <div class="section__title">
        <span class="icon"><font-awesome-icon icon="running" /></span>
        <span>Queue</span>
      </div>

      <div class="jobs__list">
        <figure
          v-for="(photo, index) of $nudify.waiting"
          :key="index"
          class="job"
          :class="{ 'job--running': photo.running }"
          @click.prevent="openJob(photo.id)">
          <img :src="photo.file.dataURL">
        </figure>
      </div>
    </div>

    <div class="jobs__section">
      <div class="section__title">
        <div class="flex-1">
          <span class="icon"><font-awesome-icon icon="clipboard-list" /></span>
          <span>Pending</span>
        </div>

        <button v-show="$nudify.pending.length > 0" class="button button--xs" @click.prevent="$nudify.runAll()">
          Run all
        </button>
      </div>

      <div class="jobs__list">
        <figure
          v-for="(photo, index) of $nudify.pending"
          :key="index"
          class="job"
          @click.prevent="openJob(photo.id)">
          <img :src="photo.file.dataURL">
        </figure>
      </div>
    </div>

    <div class="jobs__section">
      <div class="section__title">
        <div class="flex-1">
          <span class="icon"><font-awesome-icon icon="clipboard-check" /></span>
          <span>Finished</span>
        </div>

        <button v-show="$nudify.finished.length > 0" class="button button--xs" @click.prevent="$nudify.runAll('finished')">
          Rerun all
        </button>
      </div>

      <div class="jobs__list">
        <figure
          v-for="(photo, index) of $nudify.finished"
          :key="index"
          class="job"
          :class="{ 'job--failed': photo.failed }"
          @click.prevent="openJob(photo.id)">
          <img :src="photo.file.dataURL">
        </figure>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    openJob(photoId) {
      this.$router.push(`/nudify/${photoId}`)
    },
  },
}
</script>

<style lang="scss" scoped>
.layout__jobbar {
  @apply relative bg-dark-500 z-10;
  @apply flex flex-col py-2;
  width: 200px;

  &::after {
    @apply border-r border-dark-300;
    @apply block bottom-0 right-0 pointer-events-none absolute;
    content: " ";
    top: 50px;
  }
}

.jobs__section {
  @apply flex-1 flex flex-col;
  @apply overflow-hidden;
}

.section__title {
  @apply px-4 pt-2 text-sm text-white font-semibold;
  @apply flex items-center;

  .icon {
    @apply mr-2;
  }
}

.jobs__list {
  @apply flex-1 flex flex-wrap justify-between;
  @apply px-4 py-2 overflow-y-auto max-h-full;

  .job {
    @apply mb-2 cursor-pointer;
    width: calc(1/3*100% - (1 - 1/3)*1rem);
    height: 42px;
    transition: all .1s ease-in-out;

    &.job--running {

      img {
        @apply border-primary-500;
      }
    }

    &.job--failed {
      img {
        @apply border-danger-500;
      }
    }

    &:hover {
      @apply z-30;
      transform: scale(1.5)
    }

    img {
      @apply border-2 border-transparent;
      @apply w-full h-full rounded-full;
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

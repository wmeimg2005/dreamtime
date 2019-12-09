<template>
  <div class="layout__jobbar">
    <div class="jobs__section">
      <div class="section__title">
        <div>
          <span class="icon"><font-awesome-icon icon="running" /></span>
          <span>Queue</span>
        </div>

        <div v-show="$nudify.waiting.length > 0" class="section__actions">
          <button
            v-tooltip="'Forget all'"
            class="button button--danger button--xs"
            @click.prevent="$nudify.forgetAll('waiting')">
            <font-awesome-icon icon="trash-alt" />
          </button>

          <button
            v-tooltip="'Stop all'"
            class="button button--xs"
            @click.prevent="$nudify.stopAll('waiting')">
            <font-awesome-icon icon="stop" />
          </button>
        </div>
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
        <div>
          <span class="icon"><font-awesome-icon icon="clipboard-list" /></span>
          <span>Pending</span>
        </div>

        <div v-show="$nudify.pending.length > 0" class="section__actions">
          <button
            v-tooltip="'Forget all'"
            class="button button--danger button--xs"
            @click.prevent="$nudify.forgetAll()">
            <font-awesome-icon icon="trash-alt" />
          </button>

          <button
            v-tooltip="'Start all'"
            class="button button--xs"
            @click.prevent="$nudify.startAll()">
            <font-awesome-icon icon="play" />
          </button>
        </div>
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

        <div v-show="$nudify.finished.length > 0" class="section__actions">
          <button
            v-tooltip="'Forget all'"
            class="button button--danger button--xs"
            @click.prevent="$nudify.forgetAll('finished')">
            <font-awesome-icon icon="trash-alt" />
          </button>

          <button
            v-tooltip="'Restart all'"
            class="button button--xs"
            @click.prevent="$nudify.startAll('finished')">
            <font-awesome-icon icon="undo" />
          </button>
        </div>
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
  @apply relative bg-dark-500 py-2 z-10;
  @apply flex flex-col;
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
  height: calc((100vh - 80px) / 3);
}

.section__title {
  @apply px-4 pt-2 text-sm text-white font-semibold;
  @apply flex items-center;

  .icon {
    @apply mr-2;
  }
}

.section__actions {
  @apply flex flex-1 justify-end ml-2;

  .button {
    @apply ml-2;
  }
}

.jobs__list {
  @apply flex-1;
  @apply px-4 py-2 overflow-y-auto max-h-full;

  .job {
    @apply inline-block mb-2 mr-2 cursor-pointer;
    width: 48px;
    height: 48px;
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
      @apply border-2 border-transparent rounded-full;
      @apply w-full h-full;
    }
  }
}
</style>

<template>
  <div id="queuebar" class="layout__jobbar">
    <section id="queuebar-running">
      <div class="section__header">
        <div class="section__title">
          <span class="icon"><font-awesome-icon icon="running" /></span>
          <span>Queue</span>
        </div>

        <div v-show="$nudify.waiting.length > 0" class="section__actions">
          <button
            v-tooltip="{placement: 'bottom', content: 'Forget all'}"
            class="button button--danger button--xs"
            @click.prevent="$nudify.forgetAll('waiting')">
            <font-awesome-icon icon="trash-alt" />
          </button>

          <button
            v-tooltip="{placement: 'bottom', content: 'Stop all' }"
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
          <img :src="photo.file.path" data-private>
        </figure>
      </div>
    </section>

    <section id="queuebar-pending">
      <div class="section__header">
        <div class="section__title">
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
          <img :src="photo.file.path" data-private>
        </figure>
      </div>
    </section>

    <section id="queuebar-finished">
      <div class="section__header">
        <div class="section__title">
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
          <img :src="photo.file.path" data-private>
        </figure>
      </div>
    </section>
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
  @apply relative flex flex-col;
  @apply bg-dark-500 py-2 z-10;
  @apply border-l border-dark-100;
  width: 200px;
}

section {
  @apply flex-1 flex flex-col;
  @apply overflow-hidden;
  height: calc((100vh - 80px) / 3);

  &:not(:first-child) {
    .section__header {
      &::before, &::after {
        @apply block border-b;
        @apply absolute right-0 pointer-events-none z-0;
        content: " ";
        left: 100px;
      }

      &::before {
        @apply border-dark-200;
        top: 18px;
      }

      &::after {
        @apply border-dark-400;
        top: 19px;
      }
    }
  }

  .section__header {
    @apply px-4 pt-2 text-sm text-white font-semibold;
    @apply relative flex items-center;

    .icon {
      @apply mr-2;
    }

    .section__title {
      @apply flex-1 z-10;
    }
  }

  .section__actions {
    @apply flex flex-1 justify-end ml-2 z-10 bg-dark-500;

    .button {
      @apply ml-2;
    }
  }
}

.jobs__list {
  @apply flex-1;
  @apply px-4 py-2 overflow-y-auto max-h-full;

  .job {
    @apply inline-block mb-2 cursor-pointer;
    width: 47px;
    height: 47px;
    transition: all .1s ease-in-out;

    &:not(:nth-child(3n)) {
      @apply mr-2;
    }

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
      transform: scale(1.3)
    }

    img {
      @apply border-2 border-transparent rounded-full;
      @apply w-full h-full;
    }
  }
}
</style>

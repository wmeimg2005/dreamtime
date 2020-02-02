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
            v-tooltip="{placement: 'bottom', content: 'Forget waiting'}"
            class="button button--danger button--xs"
            @click.prevent="$nudify.forgetAll('waiting')">
            <font-awesome-icon icon="trash-alt" />
          </button>

          <button
            v-tooltip="{placement: 'bottom', content: 'Cancel waiting' }"
            class="button button--xs"
            @click.prevent="$nudify.cancelAll('waiting')">
            <font-awesome-icon icon="stop" />
          </button>
        </div>
      </div>

      <div class="jobs__list">
        <QueuePhoto
          v-for="(photo, index) of $nudify.waiting"
          :key="index"
          :photo="photo"
          data-private />
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
            @click.prevent="$nudify.addAll()">
            <font-awesome-icon icon="play" />
          </button>
        </div>
      </div>

      <div class="jobs__list">
        <QueuePhoto
          v-for="(photo, index) of $nudify.pending"
          :key="index"
          :photo="photo"
          data-private />
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
            v-tooltip="'Rerun all'"
            class="button button--xs"
            @click.prevent="$nudify.addAll('finished')">
            <font-awesome-icon icon="undo" />
          </button>
        </div>
      </div>

      <div class="jobs__list">
        <QueuePhoto
          v-for="(photo, index) of $nudify.finished"
          :key="index"
          :photo="photo"
          data-private />
      </div>
    </section>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.layout__jobbar {
  @apply relative flex flex-col;
  @apply bg-dark-500 py-2 z-10;
  @apply border-l border-dark-100;
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
  @apply flex flex-wrap flex-1;
  @apply py-2 overflow-y-auto max-h-full;
  will-change: scroll-position;
}
</style>

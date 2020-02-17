<template>
  <div class="photo" :class="photoClass">
    <div class="photo__preview" :style="previewStyle" />

    <div class="photo__content">
      <span v-show="photo.running || photo.finished">{{ photo.timer.duration }}s</span>

      <button v-tooltip="'Open'" @click="open">
        <font-awesome-icon icon="external-link-square-alt" />
      </button>

      <button v-show="photo.pending" v-tooltip="'Add to Queue'" @click="add">
        <font-awesome-icon icon="play" />
      </button>

      <button v-show="photo.waiting" v-tooltip="'Remove from Queue'" @click="cancel">
        <font-awesome-icon icon="sign-out-alt" />
      </button>

      <button v-show="photo.running" v-tooltip="'Stop'" @click="stop">
        <font-awesome-icon icon="stop" />
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    photo: {
      type: Object,
      required: true,
    },
  },

  computed: {
    previewStyle() {
      let photoPath = this.photo.file.path

      if (this.photo.finished && this.photo.runs.length > 0) {
        const [run] = this.photo.runs

        if (run.outputFile.exists) {
          photoPath = run.outputFile.path
        }
      }

      return {
        backgroundImage: `url("${photoPath}")`,
      }
    },

    photoClass() {
      return {
        'photo--running': this.photo.running,
        'photo--failed': this.photo.failed,
      }
    },
  },

  methods: {
    open() {
      this.$router.push(`/nudify/${this.photo.id}`)
    },

    add() {
      this.photo.add()
    },

    cancel() {
      this.photo.cancel()
    },

    stop() {
      this.photo.cancel()
    },
  },
}
</script>

<style lang="scss" scoped>
.photo {
  @apply w-1/2 relative border-2 border-dark-300;
  background-image: url("~@/assets/images/curls.png");
  height: 150px;
  will-change: transform;

  &.photo--running {
    @apply border-primary-500;
  }

  &.photo--failed {
    @apply border-danger-500;
  }

  &:hover {
    .photo__content {
      @apply opacity-100;
    }
  }

  .photo__preview {
    @apply absolute top-0 bottom-0 left-0 right-0 z-10;
    @apply bg-contain bg-no-repeat bg-center;
  }

  .photo__content {
    @apply absolute top-0 bottom-0 left-0 right-0 z-30;
    @apply flex bg-dark-500-60 opacity-0;
    backdrop-filter: blur(4px);
    transition: opacity .1s linear;

    span, button {
      @apply flex-1;
    }

    span {
      @apply flex items-center justify-center;
      @apply text-white font-semibold;
    }

    button {
      @apply outline-none;

      &:hover {
        @apply text-primary;
      }
    }
  }
}
</style>

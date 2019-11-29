<template>
  <div class="c-photo-run">
    <figure class="run__preview">
      <app-photo v-if="previewDataURL" :src="previewDataURL" />
    </figure>

    <div class="box run__content">
      <div class="box__content">
        <details v-show="run.running || run.failed" class="run__section" open>
          <summary class="section__title">
            Status
          </summary>

          <div class="section__content">
            <p v-show="run.running" class="text-white font-bold text-xl">
              <font-awesome-icon icon="running" /> Running ({{ run.timer.duration }}s)
            </p>

            <p v-show="run.failed" class="text-danger-500 font-bold text-xl">
              <font-awesome-icon icon="exclamation-circle" /> Error!
            </p>
          </div>
        </details>

        <details class="run__section" open>
          <summary class="section__title">
            Actions
          </summary>

          <div class="section__content">
            <button v-show="run.finished" class="button button--success" @click.prevent="save">
              Save
            </button>

            <button v-show="run.finished" class="button button--danger" @click.prevent="rerun">
              Rerun
            </button>

            <button v-show="run.running" class="button button--danger" @click.prevent="cancel">
              Cancel
            </button>
          </div>
        </details>

        <details class="run__section">
          <summary class="section__title">
            Preferences
          </summary>

          <div class="section__preferences">
            <p>
              <span class="preference__name">Boobs size</span>
              <span class="preference__value">{{ run.preferences.body.boobs.size | size }}</span>
            </p>

            <p>
              <span class="preference__name">Areola size</span>
              <span class="preference__value">{{ run.preferences.body.areola.size | size }}</span>
            </p>

            <p>
              <span class="preference__name">Nipple size</span>
              <span class="preference__value">{{ run.preferences.body.nipple.size | size }}</span>
            </p>

            <p>
              <span class="preference__name">Vagina size</span>
              <span class="preference__value">{{ run.preferences.body.vagina.size | size }}</span>
            </p>

            <p>
              <span class="preference__name">Pubic Hair size</span>
              <span class="preference__value">{{ run.preferences.body.pubicHair.size | size }}</span>
            </p>
          </div>
        </details>

        <details class="run__section">
          <summary class="section__title">
            Console
          </summary>

          <div class="section__console">
            <li v-for="(item, index) in run.cli.lines" :key="index" :class="item.css">
              > {{ item.text }}
            </li>
          </div>
        </details>
      </div>
    </div>
  </div>
</template>

<script>
import { isNil } from 'lodash'

const { showSaveDialogSync } = $provider.api.dialog

export default {
  filters: {
    size(value) {
      return Number.parseFloat(value).toFixed(2)
    },
  },

  props: {
    run: {
      type: Object,
      required: true,
    },
  },

  data: () => ({
    outputDataURL: undefined,
  }),

  computed: {
    previewDataURL() {
      return this.run.outputFile.dataURL
    },
  },

  watch: {
    'run.finished'(value) {
      if (value) {
        this.outputDataURL = this.run.outputFile.dataURL
      }
    },
  },

  methods: {
    save() {
      const savePath = showSaveDialogSync({
        defaultPath: this.run.outputName,
        filters: [
          { name: 'PNG', extensions: ['png'] },
        ],
      })

      if (isNil(savePath)) {
        return
      }

      this.run.outputFile.copy(savePath)
    },

    rerun() {
      this.run.photo.rerun(this.run)
    },

    cancel() {
      this.run.photo.cancelRun(this.run)
    },
  },
}
</script>

<style lang="scss">
.c-photo-run {
  @apply flex flex-col;


  /*
  .__preview {
    @apply flex justify-center items-center
        rounded rounded-tr-none rounded-br-none
        border-2 border-dark-500 border-r-0
        text-3xl;
    width: 125px;
    height: 125px;

    img {
      @apply w-full h-full rounded rounded-tr-none rounded-br-none;
      transition: all 0.15s ease-in-out;

      &:hover {
        @apply rounded z-50;
        transform: scale(3);
      }
    }
  }

  .__content {
    @apply flex-1 flex flex-col
        bg-dark-500
        rounded
        rounded-tl-none
        rounded-bl-none
        px-4
        shadow;

    width: 200px;

    .__section {
      @apply py-2;

      &:not(:last-child) {
        @apply border-b border-dark-400;
      }

      .__title {
        @apply text-xs uppercase text-generic-300 mb-2 cursor-pointer;
      }

      .__status {
        @apply flex justify-center
          text-xl font-bold;
      }

      .__buttons {
        @apply flex justify-center items-center;
      }

      .__console {
        @apply p-2 bg-black overflow-auto rounded;
        height: 150px;

        li {
          @apply font-mono text-xs text-generic-100 mb-2 block;

          &.text-danger {
            @apply text-danger;
          }
        }
      }

      .__preferences {
        p {
          @apply text-sm;

          .__name {
            @apply inline-block text-generic-300;
            width: 150px;
          }

          .__value {
            @apply inline-block font-bold text-generic-100;
          }
        }
      }
    }
  }
  */
}

.run__preview {
  @apply flex justify-center;
}

.run__content {
  .run__section {
    &:not(:last-child) {
      @apply mb-4;
    }
  }

  .section__title {
    @apply text-generic-300 font-semibold cursor-pointer outline-none;
  }

  .section__content {
    @apply px-4 pt-2 text-center;
  }
}

.section__preferences {
  p {
    @apply text-sm;

    .preference__name {
      @apply inline-block text-generic-300;
      width: 150px;
    }

    .preference__value {
      @apply inline-block font-bold text-generic-100;
    }
  }
}

.section__console {
  @apply p-2 bg-black overflow-auto rounded;
  height: 150px;

  li {
    @apply font-mono text-xs text-generic-100 mb-2 block;

    &.text-danger {
      @apply text-danger-500;
    }
  }
}
</style>

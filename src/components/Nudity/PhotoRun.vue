<template>
  <div class="photo-run" :class="previewClass" data-private>
    <div class="run__preview" :style="previewStyle" />

    <div
      v-if="run.preferences.body.randomize || run.preferences.body.progressive.enabled"
      class="run__preferences">
      <div class="preference">
        <span>Boobs</span>
        <span>{{ run.preferences.body.boobs.size | fixedValue }}</span>
      </div>

      <div class="preference">
        <span>Areola</span>
        <span>{{ run.preferences.body.areola.size | fixedValue }}</span>
      </div>

      <div class="preference">
        <span>Nipple</span>
        <span>{{ run.preferences.body.nipple.size | fixedValue }}</span>
      </div>

      <div class="preference">
        <span>Vagina</span>
        <span>{{ run.preferences.body.vagina.size | fixedValue }}</span>
      </div>

      <div class="preference">
        <span>Pubic hair</span>
        <span>{{ run.preferences.body.pubicHair.size | fixedValue }}</span>
      </div>
    </div>

    <div class="run__content">
      <div v-if="run.running" class="content__item">
        <p class="text-white">
          <span>
            <font-awesome-icon icon="running" />
          </span>
          <span>{{ run.timer.duration }}s</span>
        </p>
      </div>

      <div v-else-if="run.failed" class="content__item">
        <p class="text-danger-500">
          <span>
            <font-awesome-icon icon="exclamation-circle" />
          </span>
          <span>Error!</span>
        </p>
      </div>

      <div v-else-if="run.finished" class="content__item">
        <p class="text-white">
          <span>
            <font-awesome-icon icon="heart" />
          </span>
          <span>{{ run.timer.duration }}s</span>
        </p>
      </div>

      <div v-else class="content__item">
        <p class="text-white">
          <span>
            <font-awesome-icon icon="clock" />
          </span>
        </p>
      </div>

      <div v-show="run.finished && run.outputFile.exists" class="content__item">
        <button
          v-tooltip="'Open photo'"
          class="button button--info button--sm"
          @click.prevent="open">
          <font-awesome-icon icon="image" />
        </button>
      </div>

      <div v-show="run.finished && run.outputFile.exists" class="content__item">
        <button
          v-tooltip="'Save photo'"
          class="button button--info button--sm"
          @click.prevent="save">
          <font-awesome-icon icon="save" />
        </button>
      </div>

      <div v-show="run.finished" class="content__item">
        <button v-tooltip="'Rerun'" class="button button--success button--sm" @click.prevent="rerun">
          <font-awesome-icon icon="undo" />
        </button>
      </div>

      <div v-show="run.running" class="content__item">
        <button v-tooltip="'Stop'" class="button button--danger button--sm" @click.prevent="cancel">
          <font-awesome-icon icon="stop" />
        </button>
      </div>

      <div v-show="hasMaskfin" class="content__item">
        <button
          v-tooltip="'View Maskfin'"
          class="button button--sm"
          @click.prevent="$refs.maskfinDialog.showModal()">
          <font-awesome-icon icon="mask" />
        </button>
      </div>

      <div class="content__item">
        <button
          v-tooltip="'View terminal'"
          class="button button--sm"
          @click.prevent="$refs.terminalDialog.showModal()">
          <font-awesome-icon icon="terminal" />
        </button>
      </div>
    </div>

    <!-- Maskfin Dialog -->
    <dialog v-if="hasMaskfin" ref="maskfinDialog">
      <div class="dialog__content dialog__maskfin">
        <div class="maskfin__preview">
          <img :src="run.maskfinFile.path">
        </div>

        <div class="maskfin__description">
          <p>This is the Maskfin, a mask that represents in layers the areas that the algorithm will replace with the fake nude.</p>
          <p>Click on the "Add to queue" button to add it as an additional photo, edit the layers with the editor and continue with the nudification. You can also save it to your computer, edit it with an external program and continue the nudification manually.</p>
          <p>
            For more information please consult the
            <a :href="manualURL" target="_blank">guide</a>.
          </p>
        </div>

        <div class="dialog__buttons">
          <button class="button" @click.prevent="addMaskToQueue">
            Add to queue
          </button>

          <button class="button button--success" @click.prevent="saveMask">
            Save
          </button>

          <button class="button button--danger" @click.prevent="$refs.maskfinDialog.close()">
            Close
          </button>
        </div>
      </div>
    </dialog>

    <!-- Terminal Dialog -->
    <dialog ref="terminalDialog">
      <div class="dialog__content">
        <div class="terminal">
          <li
            v-for="(item, index) in run.cli.lines"
            :key="index"
            :class="item.css">
            > {{ item.text }}
          </li>
        </div>

        <div class="dialog__buttons">
          <button class="button button--danger" @click.prevent="$refs.terminalDialog.close()">
            Close
          </button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script>
import { dreamtrack } from '~/modules/services'
import { Nudify } from '~/modules/nudify'

export default {
  filters: {
    size(value) {
      return Number.parseFloat(value).toFixed(2)
    },

    fixedValue(value) {
      return Number(value).toFixed(2)
    },
  },

  props: {
    run: {
      type: Object,
      required: true,
    },
  },

  computed: {
    previewStyle() {
      if (!this.run.finished) {
        return {}
      }

      const url = encodeURI(this.run.outputFile.path)

      return { backgroundImage: `url(${url})` }
    },

    previewClass() {
      return {
        'run--failed': this.run.failed,
        'run--running': this.run.running,
        'run--finished': this.run.finished,
      }
    },

    hasMaskfin() {
      return this.run.maskfinFile.exists
    },

    manualURL() {
      return dreamtrack.get(
        'urls.docs.manual',
        'https://time.dreamnet.tech/docs/guide/upload',
      )
    },
  },

  methods: {
    save() {
      this.run.outputFile.save(this.run.outputName)
    },

    open() {
      this.run.outputFile.openItem()
    },

    rerun() {
      this.run.add()
    },

    cancel() {
      this.run.cancel()
    },

    addMaskToQueue() {
      Nudify.add(this.run.maskfinFile, { isMaskfin: true })
    },

    saveMask() {
      this.run.maskfinFile.save(`maskfin-${this.run.outputName}`)
    },
  },
}
</script>

<style lang="scss" scoped>
.photo-run {
  @apply relative border-2 border-dark-500;
  background-image: url("~@/assets/images/curls.png"); /* Background pattern from Toptal Subtle Patterns */
  min-height: 512px;
  transition: border-color 0.2s linear;

  &.run--failed {
    @apply border-danger-500;
  }

  &.run--running {
    @apply border-primary-500;
  }

  &.run--finished {
    .run__preview {
      @apply opacity-100;
    }
  }

  &:hover {
    @apply border-primary-300;

    .run__content,
    .run__preferences {
      @apply opacity-100;
    }
  }

  .run__preview {
    @apply absolute opacity-0 left-0 right-0 top-0 bottom-0 z-10;
    @apply bg-contain bg-center bg-no-repeat;
    transition: opacity 0.3s linear;
  }
}

.run__content,
.run__preferences {
  @apply absolute z-20;
  @apply flex opacity-0 bg-dark-800-80 w-full;
  backdrop-filter: blur(6px);
  transition: opacity 0.1s linear;
}

.run__preferences {
  @apply flex top-0;
  height: 80px;

  .preference {
    @apply flex flex-col flex-1 items-center justify-center;

    span {
      &:first-child {
        @apply text-xs;
      }

      &:last-child {
        @apply text-sm text-white font-bold;
      }
    }
  }
}

.run__content {
  @apply bottom-0;
  height: 100px;

  .content__item {
    @apply flex-1 flex justify-center items-center;

    &:not(:first-child) {
      @apply mr-2;
    }

    .button {
      @apply w-full;
    }

    p {
      @apply font-bold text-center;

      span {
        @apply block;
      }
    }
  }
}

.dialog__maskfin {
  a {
    @apply text-primary-500 underline;
  }

  .maskfin__preview {
    @apply mb-4 flex justify-center items-center;

    img {
      max-height: 350px;
    }
  }

  .maskfin__description {
    @apply mb-4 text-sm;

    p {
      @apply mb-2;
    }
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

.terminal {
  @apply p-2 mb-2 bg-black overflow-auto rounded;
  height: 400px;

  li {
    @apply font-mono text-xs text-generic-100 mb-2 block;

    &.text-danger {
      @apply text-danger-500;
    }
  }
}
</style>

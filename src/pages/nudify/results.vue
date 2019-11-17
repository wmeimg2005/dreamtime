<template>
  <div v-if="photo.started" class="nudify-results">
    <div class="results__status">
      <h2 v-if="!photo.running">
        Dream come true, we hope it is pleasant.
      </h2>

      <h2 v-else>
        Hurry up, We're Dreaming
      </h2>
    </div>

    <div class="flex justify-center">
      <div class="box">
        <div class="box__content">
          <div v-if="!photo.running" class="buttons">
            <button type="button" class="button is-success" @click.prevent="nudify">
              Nudify again
            </button>

            <button type="button" class="button" @click.prevent="openFolder">
              Open Folder
            </button>

            <nuxt-link to="/" class="button is-danger">
              Another photo
            </nuxt-link>
          </div>

          <div v-else class="buttons">
            <button type="button" class="button is-danger" @click.prevent="cancel">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Jobs -->
    <div class="results__jobs">
      <nudity-job v-for="(job, index) in photo.jobs" :key="index" :job="job" />
    </div>
  </div>

  <div v-else class="nudify-results">
    <div class="results__status">
      <h2>
        What are you waiting for? Let's dream together
      </h2>
    </div>

    <div class="flex justify-center">
      <section class="box">
        <div class="box__content">
          <nuxt-link to="/" class="button is-danger">
            Cancel
          </nuxt-link>

          <button class="button is-success" @click="nudify">
            Dream!
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({

  }),

  computed: {
    photo() {
      return this.$nudify.photo
    },

    /**
     *
     */
    preferences() {
      return this.$nudify.photo.preferences
    },
  },

  methods: {
    /**
     *
     */
    nudify() {
      this.photo.start()
    },

    /**
     *
     */
    cancel() {
      this.photo.cancel()
    },

    /**
     *
     */
    openFolder() {
      $tools.shell.openItem(this.photo.getFolderPath())
    },
  },
}
</script>

<style lang="scss">
.nudify-results {


  .content-body {
    @apply flex;
  }

  .__summary {
    @apply flex-1 mr-4;

    .__content {
      @apply sticky top-0;
    }

    .__status {
      @apply flex justify-center items-center
        text-xl;
    }

    .__photos {
      @apply flex justify-center
        mb-4;

      .app-photo {
        &:not(:last-child) {
          @apply mr-4;
        }
      }
    }

    .__actions {
      @apply flex;

      .buttons {
        @apply flex-1 flex-col justify-center;
      }
    }
  }

  .__jobs {
    @apply flex-1 flex flex-col;

    .c-nudity-job {
      @apply mr-4 mb-4;
    }
  }

  .c-settings-preferences {
    @apply flex-1;
  }
}

.results__status {
  @apply flex justify-center mb-6;

  h2 {
    @apply text-xl text-white;
  }
}
</style>

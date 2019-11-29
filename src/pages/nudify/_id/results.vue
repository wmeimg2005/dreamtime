<template>
  <!-- Results -->
  <div v-if="photo.started" class="nudify-results">
    <div class="results__status">
      <h2 v-if="!photo.running">
        Dream come true, we hope it is pleasant.
      </h2>

      <h2 v-else>
        Hurry up, We're Dreaming
      </h2>
    </div>

    <!-- Runs -->
    <div class="results__runs">
      <nudify-photo-run v-for="(run, index) in photo.runs" :key="index" :run="run" />
    </div>
  </div>

  <!-- Waiting -->
  <div v-else-if="photo.waiting" class="nudify-results">
    <div class="results__status">
      <h2>
        Waiting for other dreams to end...
      </h2>
    </div>
  </div>

  <!-- Pending -->
  <div v-else class="nudify-results">
    <div class="results__status">
      <h2>
        What are you waiting for? Let's dream together
      </h2>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    photo() {
      return this.$parent.photo
    },

    /**
     *
     */
    preferences() {
      return this.photo.preferences
    },
  },
}
</script>

<style lang="scss">
.nudify-results {

}

.results__status {
  @apply flex justify-center mb-6;

  h2 {
    @apply text-xl text-white;
  }
}

.results__runs {
  @apply flex flex-wrap justify-between;

  .c-photo-run {
    width: calc(1/4*100% - (1 - 1/4)*1rem);
  }
}
</style>

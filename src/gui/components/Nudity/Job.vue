<template>
  <div class="c-nudity-job">
    <div class="job-photos">
      <figure>
        <img src="https://i.imgur.com/bfRkl2g.jpg" />
      </figure>

      <figure>
        <img src="https://i.imgur.com/bfRkl2g.jpg" />
      </figure>

      <figure>
        <img src="https://i.imgur.com/bfRkl2g.jpg" />
      </figure>

      <figure>
        <img src="https://i.imgur.com/bfRkl2g.jpg" />
      </figure>

      <figure>
        <img src="https://i.imgur.com/bfRkl2g.jpg" />
      </figure>

      <figure>
        <img src="https://i.imgur.com/bfRkl2g.jpg" />
      </figure>
    </div>

    <div class="job-actions">
      <button class="button is-success">Save</button>
      <button class="button is-danger">Remake</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    job: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss">
.c-nudity-job {
  @apply flex border-b border-gray-200 py-3;
  height: 150px;

  .job-photos {
    @apply flex-1 inline-flex overflow-auto border-r border-gray-200;

    figure {
      @apply relative pr-6 text-center;
      flex-shrink: 0;
      box-sizing: content-box;
      width: 125px;
      height: 125px;

      &::after {
        content: '➡';
        @apply absolute right-0;
        top: 40%;
        right: 3px;
      }

      img {
        @apply w-full h-full;
      }
    }
  }

  .job-actions {
    @apply flex flex-col justify-center items-center;
    width: 150px;
  }
}
</style>

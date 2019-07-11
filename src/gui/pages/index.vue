<template>
  <div class="home">
    <app-title>
      <h1 class="title">
        Welcome to {{ app.name }} <sup>{{ app.status }}</sup>
      </h1>

      <h3 class="subtitle">
        #freedom #opensource #rule34
      </h3>
    </app-title>

    <div class="home-wip">
      <!--
      <p>
        Go to the <nuxt-link to="/models">Models</nuxt-link> page to organize your nudes or...
      </p>
      -->

      <nudity-upload />
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss">
.home {
  .home-wip {
    @apply flex flex-col justify-center items-center pt-20;

    a {
      @apply text-primary underline;
    }
  }
}
</style>

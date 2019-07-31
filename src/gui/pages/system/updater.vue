<template>
  <div class="updater">
    <app-title>
      <h1 class="title">
        🌎 Updater
      </h1>

      <h3 class="subtitle">
        Always keep {{ $dream.name }} and Checkpoints up to date!
      </h3>
    </app-title>

    <div class="updater-app">
      <h2 class="updater-title">{{ $dream.name }}</h2>
    </div>

    <div class="updater-checkpoints">
      <h2 class="updater-title">Checkpoints</h2>
    </div>
  </div>
</template>

<script>
export default {
  created() {}
}
</script>


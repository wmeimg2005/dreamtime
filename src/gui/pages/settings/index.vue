<template>
  <div class="settings">
    <app-title>
      <h1 class="title">
        🔧 Settings
      </h1>

      <h3 class="subtitle">
        Customize the way {{ app.name }} works.
      </h3>
    </app-title>

    <div class="content-body">
      <div class="buttons is-group is-center">
        <button class="button is-outlined is-sm">Processing</button>
        <button class="button is-outlined is-sm">Preferences</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss">
.settings {
  .buttons {
    @apply border-b border-gray-200 pb-6;
  }
}
</style>

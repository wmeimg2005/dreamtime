<template>
  <div class="menu">
    <section>
      <!-- Upload Mode -->
      <select
        v-model="$settings.app.uploadMode"
        v-tooltip="{ content: 'Upload mode. What will happen when uploading a photo.', placement: 'right' }"
        class="input input--menu">
        <option value="none">
          Add to Pending
        </option>
        <option value="add-queue">
          Add to Queue
        </option>
        <option value="go-preferences">
          Add to Pending and Open preferences
        </option>
      </select>
    </section>

    <!-- Custom menu -->
    <portal-target name="menu"
                   class="menu__custom" />

    <!-- Random Lesson -->
    <section v-if="help.randomLesson">
      <HelpLesson :lesson="help.randomLesson"
                  :small="true"
                  @click="$router.push('/help')" />
    </section>
  </div>
</template>

<script>
import { Help } from '~/modules'

export default {
  data: () => ({
    help: Help,
  }),
}
</script>

<style lang="scss" scoped>
.menu {
  @apply flex flex-col;
  @apply p-3 bg-dark-500;
  grid-area: menu;

  section {
    &:not(:last-child) {
      @apply pb-6 border-b-2 border-dark-400;
      @apply mb-3;
    }
  }
}

.menu__custom {
  @apply flex-1;
}

.lesson {
  @apply bg-dark-900 cursor-pointer;
  @apply shadow;
  @include transition('background-color, box-shadow', 0.2s);

  &:hover {
    @apply bg-dark-800 shadow-lg;
  }
}
</style>

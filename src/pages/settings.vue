<template>
  <div class="settings content__body">
    <div class="settings__menu">
      <div class="menu__container">
        <div class="box box--items">
          <div class="box__content">
            <box-item
              label="Application"
              icon="window-maximize"
              href="/settings/app" />

            <box-item
              label="Processing"
              icon="cogs"
              href="/settings/processing" />

            <box-item
              label="Preferences"
              icon="sliders-h"
              href="/settings/preferences" />

            <box-item
              label="Notifications"
              icon="bell"
              href="/settings/notifications" />

            <box-item
              label="Folders"
              icon="folder"
              href="/settings/folders" />

            <box-item
              label="Telemetry"
              icon="paper-plane"
              href="/settings/telemetry" />
          </div>
        </div>
      </div>
    </div>

    <div class="settings__content">
      <nuxt-child v-model="settings" keep-alive />
    </div>
  </div>
</template>

<script>
const { settings } = $provider.services

export default {
  middleware: ({ route, redirect }) => {
    const { fullPath } = route

    if (fullPath === `/settings`) {
      redirect('/settings/app')
    }
  },

  data: () => ({
    settings: {},
  }),

  watch: {
    settings: {
      handler: (value) => {
        settings.set(value)
      },
      deep: true,
    },
  },

  created() {
    this.settings = settings.get()
  },
}
</script>

<style lang="scss" scoped>
.settings {
  @apply relative flex;
}

.settings__menu {
  @apply mr-4;
  width: 200px;

  .menu__container {
    @apply sticky;
    top: 1.5rem;
  }
}

.settings__content {
  @apply flex-1;
}

.settings-fields-section {
  &:not(:last-child) {
    @apply border-b border-gray-200;
  }
}

.settings-field {
  @apply flex;
}
</style>

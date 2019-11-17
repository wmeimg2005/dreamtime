<template>
  <div class="settings-fields">
    <section class="box box--items">
      <div class="box__content">
        <box-item
          label="Every Run"
          description="Notify when the program is not in the foreground and a single run have finished.">
          <select v-model="currentValue.notifications.run" class="input">
            <option :value="true">
              Enabled
            </option>
            <option :value="false">
              Disabled
            </option>
          </select>
        </box-item>

        <box-item
          label="Every Dream"
          description="Notify when the program is not in the foreground and all the runs have finished.">
          <select v-model="currentValue.notifications.allRuns" class="input">
            <option :value="true">
              Enabled
            </option>
            <option :value="false">
              Disabled
            </option>
          </select>
        </box-item>

        <box-item
          :description="`Notify when there is a new version of ${$dream.name}, DreamPower or Checkpoints.`"
          label="Update Available">
          <select v-model="currentValue.notifications.update" class="input">
            <option :value="true">
              Enabled
            </option>
            <option :value="false">
              Disabled
            </option>
          </select>
        </box-item>
      </div>
    </section>
  </div>
</template>

<script>
import { VModel } from '~/mixins'

export default {
  mixins: [VModel],

  created() {
    $nucleus.track('PAGE_SETTINGS_NOTIFICATIONS')
  },
}
</script>

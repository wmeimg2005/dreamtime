<template>
  <div class="settings-fields">
    <section class="box box--items">
      <div class="box__content">
        <box-item
          label="Disable Hardware Acceleration"
          description="It can improve application performance on some systems. (Requires restart to take effect.)">
          <select v-model="currentValue.app.disableHardwareAcceleration" class="input">
            <option :value="false">
              No
            </option>
            <option :value="true">
              Yes
            </option>
          </select>
        </box-item>

        <box-item
          label="On Upload"
          description="Select what should be done when uploading a new photo.">
          <select v-model="currentValue.app.uploadMode" class="input">
            <option value="none">
              Stay
            </option>
            <option value="add-queue">
              Start photo transformation
            </option>
            <option value="go-preferences">
              Change photo preferences
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
}
</script>

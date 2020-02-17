<template>
  <div class="wizard-user">
    <div class="layout__header">
      <h1 class="title">
        <font-awesome-icon icon="magic" /> Setup Wizard
      </h1>

      <h2 class="subtitle">
        Telemetry
      </h2>
    </div>

    <div class="user__content">
      <section class="mb-10">
        <p>
          DreamNet respects the privacy of its users, <strong>the photos you nudify using DreamTime do not abandon your computer in any way</strong>, we only collect anonymous information with the exclusive objective of improving the application.
        </p>

        <p>
          Below you can get more information about what we collect:
        </p>
      </section>

      <section class="user__section">
        <div class="left">
          <h2 class="title">
            Analytics
          </h2>

          <p>
            Information that helps us generate anonymous statistics.
          </p>

          <ul>
            <li>Operating system.</li>
            <li>Country.</li>
            <li>Important events.</li>
          </ul>
        </div>

        <div class="right">
          <div class="box box--items">
            <div class="box__content">
              <box-item
                label="User."
                description="Anonymous username used to identify your session. It can be especially useful for technical support.">
                <input v-model="$settings.user" disabled class="input">
              </box-item>
            </div>
          </div>
        </div>
      </section>

      <section class="user__section">
        <div class="left">
          <h2 class="title">
            Bug report.
          </h2>

          <p>
            Detailed information of the exact moment an error occurred.
          </p>

          <p>
            This helps us solve errors faster.
          </p>

          <ul>
            <li>Operating system.</li>
            <li>CPU, RAM and GPU.</li>
            <li>User settings.</li>
            <li>Console log.</li>
          </ul>

          <a href="https://i.gyazo.com/30972dbc8c2396b58928b5100a016e2d.png" target="_blank" class="button button--info">Example</a>
        </div>

        <div class="right">
          <div class="box box--items">
            <div class="box__content">
              <box-item
                label="Bug report."
                description="Allow to report errors automatically.">
                <select v-model="$settings.telemetry.bugs" class="input">
                  <option :value="true">
                    Enabled
                  </option>
                  <option :value="false">
                    Disabled
                  </option>
                </select>
              </box-item>
            </div>
          </div>
        </div>
      </section>

      <section class="user__section">
        <div class="left">
          <h2 class="title">
            Session tracking.
          </h2>

          <p>
            Detailed information on how you use the application.
          </p>

          <p>
            This helps us know how we can make the application more accessible, also provides additional data to solve errors.
          </p>

          <ul>
            <li>Operating system.</li>
            <li>Actions you have taken.</li>
            <li>Mouse movement inside the application. (Photos and sensitive information are censored.)</li>
            <li>Console log.</li>
          </ul>

          <a href="https://link.dreamnet.tech/ipfs/QmQd5LKLVs73et1CvchHkq1J99PssoWfa5zRZD4ayqTrML" target="_blank" class="button button--info">Example</a>
        </div>

        <div class="right">
          <div class="box box--items">
            <div class="box__content">
              <box-item
                label="Session tracking."
                description="Allow to send detailed information about how you use the application.">
                <select v-model="$settings.telemetry.dom" class="input">
                  <option :value="true">
                    Enabled
                  </option>
                  <option :value="false">
                    Disabled
                  </option>
                </select>
              </box-item>
            </div>
          </div>
        </div>
      </section>

      <button class="button button--xl" @click.prevent="next">
        Continue
      </button>
    </div>
  </div>
</template>

<script>
import { settings } from '~/modules/system'

export default {
  layout: 'wizard',

  middleware({ redirect }) {
    if (settings.wizard.telemetry) {
      redirect('/')
    }
  },

  methods: {
    next() {
      settings.wizard.telemetry = true
      this.$router.push('/')
    },
  },
}
</script>

<style lang="scss" scoped>
.wizard-user {
  p {
    @apply text-lg;

    &:not(:last-child) {
      @apply mb-4;
    }
  }
}

.user__section {
  @apply flex;
  @apply mb-6 pb-6 border-b border-dark-500;

  .left {
    @apply flex-1 mr-8;
  }

  .right {
    @apply flex-1;
  }

  .title {
    @apply text-xl text-white font-semibold;
  }

  ul {
    @apply list-disc ml-6 mb-4;
  }
}
</style>

<template>
  <div class="about content__body">
    <div class="wrapper">
      <div v-if="alert" class="notification text-lg" v-html="alert" />

      <!-- Offline -->
      <div v-if="!$provider.system.online" class="notification notification--warning">
        <span class="icon"><font-awesome-icon icon="exclamation-triangle" /></span>
        <span><strong>Offline mode</strong>. You will not be able to install updates and get the latest information.</span>
      </div>

      <!-- Offline -->
      <div v-else-if="!dreamtrack.enabled" class="notification notification--warning">
        <span class="icon"><font-awesome-icon icon="exclamation-triangle" /></span>
        <span>The connection to the server could not be established. You will not be able to install updates and get the latest information.</span>
      </div>

      <div v-if="dreamtrack.enabled" class="about__stats">
        <p>
          <span class="stats__value">{{ stats | stat('users.realtime') }}</span>
          <span v-tooltip="{ content: 'Users like you who are using the application right now!', placement: 'bottom' }" class="stats__label">real-time users.</span>
        </p>

        <p>
          <span class="stats__value">{{ stats | stat('users.total') }}</span>
          <span class="stats__label">users.</span>
        </p>

        <p>
          <span class="stats__value">{{ stats | stat('sessions.total') }}</span>
          <span v-tooltip="{ content: 'Number of times the application has been opened.', placement: 'bottom' }" class="stats__label">sessions.</span>
        </p>

        <p>
          <span class="stats__value">{{ stats | stat('events.total.DREAM_COMPLETED') }}</span>
          <span v-tooltip="{ content: 'Number of times a successful nudification has been completed.', placement: 'bottom' }" class="stats__label">nudifications.</span>
        </p>
      </div>

      <div class="about__columns">
        <!-- DreamTime -->
        <section class="box box--items">
          <div class="box__content">
            <box-item
              :label="$dream.name"
              :description="dreamtime.about.description">
              <template slot="icon">
                <div class="item__icon">
                  <img src="~/assets/images/apps/dreamtime.png">
                </div>
              </template>

              <button type="button" class="button w-full" @click="openAppPath">
                App
              </button>
            </box-item>

            <app-update :project-title="$dream.name" project="dreamtime" href="/wizard/dreamtime" />

            <box-item
              v-for="(item, index) in dreamtime.about.navigation"
              :key="index"
              :label="item.label"
              :description="item.description"
              :icon="item.icon"
              :href="item.href"
              :version="item.version" />
          </div>
        </section>

        <!-- DreamPower -->
        <section class="box box--items">
          <div class="box__content">
            <box-item
              :label="dreampower.about.title"
              :description="dreampower.about.description">
              <template slot="icon">
                <div class="item__icon">
                  <img src="~/assets/images/apps/dreampower.png">
                </div>
              </template>

              <button type="button" class="button w-full" @click="openPowerPath">
                App
              </button>
            </box-item>

            <app-update project-title="DreamPower" project="dreampower" href="/wizard/power" />

            <app-update project-title="Checkpoints" project="checkpoints" href="/wizard/checkpoints" />

            <box-item
              v-for="(item, index) in dreampower.about.navigation"
              :key="index"
              :label="item.label"
              :description="item.description"
              :icon="item.icon"
              :href="item.href"
              :version="item.version" />
          </div>
        </section>
      </div>

      <div v-show="dreamtrack.enabled" class="about__columns">
        <!-- Sponsors -->
        <section class="box box--items is-contributors">
          <div class="box__content">
            <box-item
              icon="thumbs-up"
              label="Sponsors"
              description="Incredible services that support the project." />

            <box-item
              v-for="(item, index) in sponsors"
              :key="index"
              :label="item.label"
              :description="item.description"
              :href="item.href"
              :icon="item.icon" />

            <box-item
              label="Become a sponsor"
              icon="check-circle"
              href="https://www.patreon.com/join/dreamnet/checkout?rid=4426478" />
          </div>
        </section>

        <!-- Supporters -->
        <section class="box box--items is-contributors">
          <div class="box__content">
            <box-item
              icon="heart"
              label="Supporters"
              description="Wonderful people that without them this would not be possible." />

            <box-item
              v-for="(item, index) in supporters"
              :key="index"
              :label="item.name"
              :description="item.description"
              :icon="item.icon"
              :class="item.role" />
          </div>
        </section>

        <!-- Developers -->
        <section class="box box--items is-contributors">
          <div class="box__content">
            <box-item
              :icon="['fas', 'code']"
              label="Developers"
              description="Semi gods who have used their skills to create this incredible project." />

            <box-item
              v-for="(item, index) in developers"
              :key="index"
              :label="item.name"
              :description="item.description"
              :icon="item.icon"
              :class="item.role">
              <a v-for="(link, lindex) in item.links" :key="`link-${lindex}`" :href="link.href" target="_blank" class="button button--sm mr-2">
                {{ link.name }}
              </a>
            </box-item>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { get } from 'lodash'
import { requirements } from '~/modules/system'
import { dreamtrack } from '~/modules/services'

const { getAppPath, getPowerPath } = $provider.paths
const { shell } = $provider.api

export default {
  filters: {
    stat(value, key) {
      value = get(value, key, 0)
      return new Intl.NumberFormat('en-us', { }).format(value)
    },
  },

  data: () => ({
    channel: null,
    stats: {},

    requirements,
    dreamtrack,
  }),

  computed: {
    dreamtime() {
      const online = dreamtrack.get('projects.dreamtime', {})

      return {
        about: {
          description: process.env.npm_package_description,
          navigation: [],
        },

        ...online,
      }
    },

    dreampower() {
      const online = dreamtrack.get('projects.dreampower', {})

      return {
        about: {
          title: 'DreamPower',
          description: 'Deep learning algorithm capable of nudify people photos.',
          navigation: [],
        },

        ...online,
      }
    },

    sponsors() {
      return dreamtrack.get('sponsors', [])
    },

    supporters() {
      return dreamtrack.get('supporters', [])
    },

    developers() {
      return dreamtrack.get('developers', [])
    },

    alert() {
      return dreamtrack.get('alerts.about')
    },
  },

  created() {
    this.onStats()
  },

  beforeDestroy() {
    this.offStats()
  },

  methods: {
    openAppPath() {
      shell.openItem(getAppPath())
    },

    openPowerPath() {
      shell.openItem(getPowerPath())
    },

    onStats() {
      if (!dreamtrack.enabled) {
        return
      }

      this.channel = dreamtrack.service.subscribe('dreamtime:stats')

      this.channel.on('data', (payload) => {
        this.stats = payload
      })
    },

    offStats() {
      if (!this.channel) {
        return
      }

      this.channel.close()

      this.channel = null
    },
  },
}
</script>

<style lang="scss" scoped>
.about {

}

.about__stats {
  @apply flex mb-4;

  p {
    @apply mr-4 text-sm;
  }

  .stats__label {
    cursor: help;
  }

  .stats__value {
    @apply text-white font-bold;
  }
}

.about__columns {
  @apply flex flex-wrap;
  justify-content: space-between;

  .box {
    width: calc(1/2*100% - (1 - 1/2)*1rem);
  }
}
</style>

<style lang="scss">
.is-contributors {
  max-height: 400px;
  overflow-y: auto;

  .is-gold {
    .item__label {
      @apply font-bold;
      color: #d5ad6d;

      background: -webkit-linear-gradient(transparent, transparent),
        -webkit-linear-gradient(top, rgba(213, 173, 109, 1) 0%, rgba(
                213,
                173,
                109,
                1
              )
              26%, rgba(226, 186, 120, 1) 35%, rgba(163, 126, 67, 1) 45%, rgba(
                145,
                112,
                59,
                1
              )
              61%, rgba(213, 173, 109, 1) 100%);
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
}
</style>

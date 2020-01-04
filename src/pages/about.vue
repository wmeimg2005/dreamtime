<template>
  <div class="about content__body">
    <div class="wrapper">
      <div v-if="alert" class="notification text-lg" v-html="alert" />

      <!-- Offline -->
      <section v-if="!$provider.system.online" class="box box--items">
        <div class="box__content">
          <box-item
            description="While in offline mode you will not be able to obtain more information about the project or download the latest updates."
            label="Offline mode." />
        </div>
      </section>

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

        <!-- Supporters -->
        <section class="box box--items is-contributors">
          <div class="box__content">
            <box-item
              icon="grin-hearts"
              label="Supporters"
              description="Wonderful people who have helped us make this possible." />

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
import { requirements } from '~/modules/system'
import { nucleus } from '~/modules/services'

const { getAppPath, getPowerPath } = $provider.paths
const { shell } = $provider.api

export default {
  data: () => ({
    requirements,
  }),

  computed: {
    dreamtime() {
      const online = nucleus.v1?.projects?.dreamtime || {}

      return {
        about: {
          description: process.env.npm_package_description,
          navigation: [],
        },

        ...online,
      }
    },

    dreampower() {
      const online = nucleus.v1?.projects?.dreampower || {}

      return {
        about: {
          description: 'Deep learning algorithm capable of nudify people photos.',
          navigation: [],
        },

        ...online,
      }
    },

    supporters() {
      return nucleus.supporters || []
    },

    developers() {
      return nucleus.developers || []
    },

    alert() {
      return nucleus.alerts?.about
    },
  },

  methods: {
    openAppPath() {
      shell.openItem(getAppPath())
    },

    openPowerPath() {
      shell.openItem(getPowerPath())
    },
  },
}
</script>

<style lang="scss" scoped>
.about {

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

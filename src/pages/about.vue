<template>
  <div class="about content__body">
    <div v-if="alert" class="notification text-lg" v-html="alert" />

    <!-- Offline -->
    <section v-if="!$provider.tools.system.online" class="box box--items">
      <div class="box__content">
        <box-item
          description="While in offline mode you will not be able to obtain more information about the project or download the latest updates."
          label="Offline mode." />
      </div>
    </section>

    <!-- Requirements -->
    <section v-if="!$provider.tools.system.canNudify" class="box box--items">
      <div class="box__content">
        <box-item
          :description="`You need to meet all the requirements below to start using ${$dream.name}. Some require an Internet connection to update.`"
          icon="scroll"
          label="Requirements" />

        <box-item
          label="DreamPower"
          description="You have not installed DreamPower or the current version is not compatible.">
          <template slot="icon">
            <span v-if="$provider.tools.system.requirements.power.installed && $provider.tools.system.requirements.power.compatible" class="item__icon">✔</span>
            <span v-else class="item__icon">❌</span>
          </template>

          <a href="#dreampower" class="button is-sm">Update</a>
          <nuxt-link to="/settings/folders" class="button is-sm">
            Settings
          </nuxt-link>
        </box-item>

        <box-item
          label="Checkpoints"
          description="Data models required by the algorithm.">
          <template slot="icon">
            <span v-if="$provider.tools.system.requirements.power.checkpoints" class="item__icon">✔</span>
            <span v-else class="item__icon">❌</span>
          </template>

          <a href="#checkpoints" class="button">Update</a>
        </box-item>

        <box-item
          label="Media Feature Pack"
          description="Multimedia package required by some versions of Windows.">
          <template slot="icon">
            <span v-if="$provider.tools.system.requirements.windows.media" class="item__icon">✔</span>
            <span v-else class="item__icon">❗</span>
          </template>

          <a href="https://www.microsoft.com/en-us/software-download/mediafeaturepack" target="_blank" class="button">
            Download
          </a>
        </box-item>
      </div>
    </section>

    <div class="about__columns">
      <!-- DreamTime -->
      <section class="box box--items">
        <div class="box__content">
          <box-item
            :label="$dream.name"
            :description="dreamtime.about.description"
            icon="https://catalina.dreamnet.tech/ipns/QmUvudWPzRa7hgDSVFiwzFzviAZJohTrvHJNhnvytuPv3H/Assets/logos/time/png/512x512.png">
            <button type="button" class="button" @click="openAppPath">
              App
            </button>
          </box-item>

          <app-update :project-title="$dream.name" project="dreamtime" />

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
            :description="dreampower.about.description"
            icon="https://catalina.dreamnet.tech/ipns/QmUvudWPzRa7hgDSVFiwzFzviAZJohTrvHJNhnvytuPv3H/Assets/logos/power/png/512x512.png">
            <button type="button" class="button" @click="openPowerPath">
              App
            </button>
          </box-item>

          <app-update id="dreampower" project-title="DreamPower" project="dreampower" />

          <app-update v-if="$provider.tools.system.requirements.power.installed" id="checkpoints" project-title="Checkpoints" project="checkpoints" />

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
            <div class="buttons">
              <a v-for="(link, lindex) in item.links" :key="`link-${lindex}`" :href="link.href" target="_blank" class="button button--sm">
                {{ link.name }}
              </a>
            </div>
          </box-item>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
const { nucleus } = $provider.services
const { getAppPath, getPowerPath } = $provider.tools.paths
const { shell } = $provider.api

export default {
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

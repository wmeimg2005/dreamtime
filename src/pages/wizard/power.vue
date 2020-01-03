<template>
  <div class="wizard-project">
    <div class="layout__header">
      <h1 class="title">
        <font-awesome-icon icon="sync-alt" /> Updater
      </h1>

      <h2 class="subtitle">
        {{ power.title }}
      </h2>
    </div>

    <div class="project__content">
      <div class="project__overview">
        <figure>
          <img src="~/assets/images/apps/dreampower.png">
        </figure>

        <h1 class="title">
          {{ power.title }}
        </h1>

        <h2>{{ power.description }}</h2>

        <div class="project__navigation">
          <a v-for="(item, index) in power.navigation" :key="index" :href="item.href" target="_blank" class="button button--sm">{{ item.label }}</a>
        </div>
      </div>

      <div class="project__description">
        <p>To make your dreams come true it is necessary to install {{ power.title }}, the algorithm that will handle the entire nudification process.</p>
        <p>Approximately <strong>1 GB</strong> will be downloaded. (Depending on your system)</p>
        <p>If the download fails please click on the "Mirrors" button to see a list of links where you can download it manually.</p>
        <p>All downloads are saved in the <strong>Downloads</strong> folder of your operating system.</p>
      </div>
    </div>

    <div class="project__installation">
      <div class="project__update">
        <ProjectUpdate project="dreampower" />
      </div>

      <div class="project__settings">
        <div class="box box--items">
          <div class="box__header">
            <p class="title">
              Settings.
            </p>
          </div>

          <div class="box__content">
            <box-item
              label="Device."
              description="Device that will be used to transform photos and choose the appropriate version of DreamPower.">
              <select v-model="$settings.processing.device" class="input">
                <option value="CPU">
                  CPU
                </option>
                <option value="GPU">
                  NVIDIA GPU
                </option>
              </select>
            </box-item>

            <box-item
              label="Location."
              description="Folder where DreamPower will be installed.">
              <input v-model="$settings.folders.cli" readonly class="input" title="Change" @click.prevent="changePower">
            </box-item>

            <box-item
              label="Use Python."
              description="Use DreamPower Python script instead of the executable. Enable this only if you know what are you doing.">
              <select v-model="$settings.processing.usePython" class="input">
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
    </div>
  </div>
</template>

<script>
import { isNil, cloneDeep } from 'lodash'
import { nucleus } from '~/modules/services'
import { requirements } from '~/modules/system'
import { dreampower } from '~/modules/updater'

const { dialog } = $provider.api
const { existsSync } = $provider.fs

export default {
  layout: 'wizard',

  middleware({ redirect }) {
    if (requirements.power.installed && !dreampower.available) {
      redirect('/wizard/checkpoints')
    }
  },

  data: () => ({
    settings: {},
  }),

  computed: {
    power() {
      return nucleus.v1?.projects?.dreampower.about || {
        title: 'DreamPower',
        description: 'Deep Learning algorithm for nudify photos.',
        navigation: [
          {
            href: 'https://power.dreamnet.tech',
            label: 'Website',
          },
          {
            href: 'https://github.com/dreamnettech/dreampower',
            label: 'GitHub',
          },
          {
            href: 'https://www.patreon.com/dreampower',
            label: 'Patreon',
          },
        ],
      }
    },
  },

  watch: {
    settings: {
      deep: true,
      handler(value) {
        this.$settings.set(value)
        dreampower.refresh()
      },
    },
  },

  created() {
    this.settings = cloneDeep(this.$settings.payload)
  },

  methods: {
    showOpenDialog(path) {
      const dir = dialog.showOpenDialogSync({
        defaultPath: path,
        properties: ['openDirectory'],
      })

      if (isNil(dir)) {
        return path
      }

      if (!existsSync(dir[0])) {
        // ???
        return path
      }

      return dir[0]
    },

    changePower() {
      const dir = this.showOpenDialog(this.$settings.folders.cli)
      this.$settings.folders.cli = dir
    },
  },
}
</script>

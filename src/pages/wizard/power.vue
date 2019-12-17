<template>
  <div class="power">
    <div class="layout__header">
      <h1>Setup Wizard - {{ power.title }}.</h1>
    </div>

    <div class="power__content">
      <div class="power__overview">
        <figure>
          <img src="~/assets/images/apps/dreampower.png">
        </figure>

        <h1>{{ power.title }}</h1>
        <h2>{{ power.description }}</h2>

        <div class="power__navigation">
          <a v-for="(item, index) in power.navigation" :key="index" :href="item.href" target="_blank" class="button">{{ item.label }}</a>
        </div>
      </div>

      <div class="power__description">
        <p>To make your dreams come true, it is necessary for {{ $dream.name }} to download and install {{ power.title }}, the algorithm/AI that will handle the entire nudification process.</p>
        <p>Keep in mind that the download of {{ power.title }} can be up to <strong>1 GB</strong>! (Depending on your system)</p>
        <p>In case the download cannot be done automatically, please click on the "Mirrors" button to see a list of links where you can download it manually.</p>
      </div>
    </div>

    <div class="power__installation" />
  </div>
</template>

<script>
import { nucleus } from '~/modules/services'

export default {
  layout: 'wizard',

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
}
</script>

<style lang="scss" scoped>
.power__content {
  @apply flex;

  .power__overview {
    @apply flex-1 flex flex-col justify-center items-center;

    figure {
      @apply mb-6;

      img {
        height: 100px;
      }
    }

    h1 {
      @apply text-2xl text-white font-bold;
    }

    h2 {
      @apply text-lg;
    }

    .power__navigation {
      @apply mt-6;

      .button {
        &:not(:last-child) {
          @apply mr-2;
        }
      }
    }
  }

  .power__description {
    @apply flex-1 flex flex-col justify-center;

    p {
      @apply text-xl mb-6;
    }
  }
}
</style>

<template>
  <div class="about">
    <app-title>
      <h1 class="title">
        🌌 About {{ $dream.name }}
      </h1>

      <h3 class="subtitle">
        Important information, updates and community links.
      </h3>
    </app-title>

    <div class="about-body">
      <!-- DreamTime -->
      <section class="about-section box">
        <div class="about-item about-project">
          <figure class="about-item-icon">
            <img src="~/assets/images/dreamtime.png" />
          </figure>

          <div class="about-item-label">
            <p class="item-label-title">{{ $dream.name }}</p>
            <p class="item-label-subtitle">Friendly user interface for DreamPower. Transform photos easily.</p>
          </div>
        </div>

        <div class="about-item">
          <span class="about-item-icon">🌐</span>

          <div class="about-item-label">
            <p class="item-label-title">{{ $dream.name }} it's updated!</p>
            <p class="item-label-subtitle">v{{ $dream.version }}</p>
          </div>
        </div>

        <app-external-link
          v-for="(item, index) in $nucleus.about.dreamtime.navigation"
          :key="index"
          :href="item.href"
          class="about-item">
          <figure v-if="isURL(item.icon)" class="about-item-icon">
            <img :src="item.icon" />
          </figure>

          <span v-else-if="item.icon" class="about-item-icon">{{ item.icon }}</span>

          <div class="about-item-label">
            <p class="item-label-title">{{ item.label }}</p>
            <p class="item-label-subtitle">{{ item.description }}</p>
          </div>
        </app-external-link>
      </section>

      <!-- DreamPower -->
      <section class="about-section box">
        <div class="about-item about-project">
          <figure class="about-item-icon">
            <img src="~/assets/images/dreampower.png" />
          </figure>

          <div class="about-item-label">
            <p class="item-label-title">DreamPower</p>
            <p class="item-label-subtitle">Deep learning algorithm capable of nudify people photos.</p>
          </div>
        </div>

        <div class="about-item">
          <span class="about-item-icon">🌐</span>

          <div class="about-item-label">
            <p class="item-label-title">DreamPower Checkpoints are updated!</p>
            <p class="item-label-subtitle">v{{ $dream.version }}</p>
          </div>
        </div>

        <app-external-link
          v-for="(item, index) in $nucleus.about.dreampower.navigation"
          :key="index"
          :href="item.href"
          class="about-item">
          <figure v-if="isURL(item.icon)" class="about-item-icon">
            <img :src="item.icon" />
          </figure>

          <span v-else-if="item.icon" class="about-item-icon">{{ item.icon }}</span>

          <div class="about-item-label">
            <p class="item-label-title">{{ item.label }}</p>
            <p class="item-label-subtitle">{{ item.description }}</p>
          </div>
        </app-external-link>
      </section>

      <!-- DreamNet -->
      <section class="about-section box">
        <div class="about-item about-project">
          <figure class="about-item-icon">
            <img src="~/assets/images/dreamnet.png" />
          </figure>

          <div class="about-item-label">
            <p class="item-label-title">DreamNet</p>
            <p class="item-label-subtitle">Community interested in developing the technology introduced by "DeepNude"</p>
          </div>
        </div>

        <app-external-link
          v-for="(item, index) in $nucleus.about.dreamnet.navigation"
          :key="index"
          :href="item.href"
          class="about-item">
          <figure v-if="isURL(item.icon)" class="about-item-icon">
            <img :src="item.icon" />
          </figure>

          <span v-else-if="item.icon" class="about-item-icon">{{ item.icon }}</span>

          <div class="about-item-label">
            <p class="item-label-title">{{ item.label }}</p>
            <p class="item-label-subtitle">{{ item.description }}</p>
          </div>
        </app-external-link>
      </section>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  created() {},

  methods: {
    isURL(str) {
      if (_.isNil(str)) {
        return false
      }

      const pattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
          '(\\#[-a-z\\d_]*)?$',
        'i'
      ) // fragment locator
      return !!pattern.test(str)
    }
  }
}
</script>

<style lang="scss">
.about {
  .about-body {
    @apply p-5;
  }

  .about-section {
    @apply px-0 py-1;
  }

  a.about-item {
    &:hover {
      .item-label-title {
        @apply text-white;
      }
    }
  }

  .about-item {
    @apply flex py-3 px-5;

    &:not(:last-child) {
      @apply border-b border-dark-400;
    }

    .about-item-icon {
      @apply mr-4 flex items-center justify-center text-2xl;
      width: 42px;

      img {
        border-radius: 100%;
        width: 42px;
        height: 42px;
      }
    }

    .about-item-label {
      @apply flex-1 flex flex-col justify-center;
    }

    .item-label-title {
      @apply text-generic-600 font-semibold;
      transition: all 0.1s ease-in-out;
    }

    .item-label-subtitle {
      @apply text-sm;
    }
  }

  .about-project {
    .about-item-label {
      .title {
        @apply text-white font-bold;
      }
    }
  }
}
</style>

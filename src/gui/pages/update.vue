<template>
  <div class="updates">
    <app-title>
      <h1 class="title">
        🌎 Updates
      </h1>

      <h3 class="subtitle">
        Stay informed of the latest versions of {{ app.name }}.
      </h3>
    </app-title>

    <div class="content-body">
      <!-- Current version, new version and download -->
      <div class="updates-notify">
        <div class="notify-box notify-current">
          <p class="notify-version">v{{ app.version }}</p>
          <p class="notify-label">Installed</p>
        </div>

        <div class="notify-box notify-latest">
          <p class="notify-version" :class="{'is-update': isUpdateAvailable}">v{{ latestVersion.tag_name }}</p>
          <p class="notify-label">Latest</p>
        </div>

        <div class="notify-box notify-download">
          <a href="#" class="button" :class="{'is-success': isUpdateAvailable}" @click.prevent="viewLatest">View Latest</a>
        </div>
      </div>

      <!-- Releases -->
      <div ref="releases" class="updates-releases">
        <h2 class="title">Releases</h2>

        <section v-for="release in releases" :key="release.id" class="release">
          <h3 class="release-title">{{ release.name }}</h3>

          <div class="release-content markdown-content" v-html="release.body" />

          <div class="buttons">
            <a :href="release.html_url" class="button">View</a>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'
import compareVersions from 'compare-versions'
import { markdown } from 'markdown'

const hostURL = 'https://api.github.com/repos/private-dreamnet/dreamtime'

export default {
  data: () => ({
    http: undefined,

    latestVersion: {
      tag_name: '0.0.0'
    },

    currentVersion: {
      tag_name: '0.0.0'
    },

    releases: []
  }),

  computed: {
    isUpdateAvailable() {
      const latestVersion = _.get(this.latestVersion, 'tag_name', '0.0.0')

      return compareVersions(latestVersion, this.app.version) === 1
    }
  },

  created() {
    this.http = axios.create({
      baseURL: hostURL
    })

    this.fetchReleases()
  },

  methods: {
    async fetchReleases() {
      const response = await this.http.get('/releases')

      let releases = _.filter(response.data, {
        draft: false,
        prerelease: false
      })

      if (releases.length === 0) {
        return
      }

      releases = _.map(releases, release => {
        release.body = markdown.toHTML(release.body)
        return release
      })

      this.latestVersion = releases[0]

      _.forEach(releases, release => {
        const compare = compareVersions(release.tag_name, this.app.version)

        if (compare === 0) {
          // Current version
          this.currentVersion = release
        }
      })

      releases = _.take(releases, 5)

      this.releases = releases

      this.$nextTick(() => {
        const links = this.$refs.releases.querySelectorAll('.release a')

        for (const el of links) {
          el.addEventListener('click', this.openLink)
        }
      })
    },

    openLink(e) {
      e.preventDefault()
      window.deepTools.shell.openExternal(e.target.href)
    },

    viewLatest() {
      window.deepTools.shell.openExternal(this.latestVersion.html_url)
    }
  }
}
</script>

<style lang="scss">
.updates {
  .updates-notify {
    @apply flex mb-10;

    .notify-box {
      @apply flex-1 flex flex-col items-center justify-center;
    }

    .notify-version {
      @apply text-2xl text-gray-700 font-bold;
      transition: all 0.2s linear;

      &.is-update {
        @apply text-success;
      }
    }

    .notify-label {
      @apply text-gray-500;
    }
  }

  .updates-releases {
    .title {
      @apply text-2xl mb-3 border-b border-gray-300;
    }

    .release {
      @apply mb-10;

      .release-title {
        @apply text-2xl font-bold mb-1 text-gray-800;
      }

      .release-content {
        @apply mb-3;
      }
    }
  }
}
</style>

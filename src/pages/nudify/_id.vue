<template>
  <div v-if="photo" class="nudify content__body">
    <div class="nudify__menu">
      <div class="menu__container">
        <div class="mb-6 flex justify-center">
          <app-photo :src="photo.file.path" :hover="false" data-private />
        </div>

        <!-- Sections -->
        <div class="box box--items">
          <div class="box__content">
            <box-item
              label="Preferences"
              icon="sliders-h"
              :href="`/nudify/${photo.id}/preferences`" />

            <box-item
              v-show="photo.canModify"
              label="Editor"
              icon="paint-brush"
              :href="`/nudify/${photo.id}/editor`" />

            <box-item
              v-show="photo.canModify && photo.preferences.advanced.scaleMode === 'cropjs'"
              label="Crop"
              icon="crop"
              :href="`/nudify/${photo.id}/crop`" />

            <box-item
              v-show="photo.canModify && photo.preferences.advanced.scaleMode === 'overlay'"
              label="Overlay"
              icon="magic"
              :href="`/nudify/${photo.id}/overlay`" />

            <box-item
              label="Results"
              icon="heart"
              :href="`/nudify/${photo.id}/results`" />
          </div>
        </div>

        <!-- Buttons -->
        <button v-show="!photo.running && !photo.waiting" class="button button--success" @click.prevent="add">
          <span class="icon"><font-awesome-icon icon="play" /></span>
          <span>Add to queue</span>
        </button>

        <button v-show="photo.waiting" class="button button--danger" @click.prevent="cancel">
          <span>Remove from queue</span>
        </button>

        <button v-show="photo.running" class="button button--danger" @click.prevent="stop">
          <span class="icon"><font-awesome-icon icon="stop" /></span>
          <span>Stop</span>
        </button>

        <button class="button" @click.prevent="openFolder">
          <span class="icon"><font-awesome-icon icon="folder-open" /></span>
          <span>Folder</span>
        </button>

        <button class="button button--danger" @click.prevent="forget">
          <span class="icon"><font-awesome-icon icon="trash-alt" /></span>
          <span>Forget</span>
        </button>
      </div>
    </div>

    <div class="nudify__content">
      <nuxt-child keep-alive />
    </div>
  </div>
</template>

<script>
import { isNil } from 'lodash'
import { Nudify } from '~/modules/nudify'

const { shell } = $provider.api

export default {
  middleware: ({ route, redirect }) => {
    const { params, fullPath } = route

    if (isNil(params.id)) {
      redirect('/')
      return
    }

    const photo = Nudify.getPhotoById(params.id)

    if (isNil(photo)) {
      redirect('/')
      return
    }

    if (fullPath === `/nudify/${params.id}`) {
      if (photo.running || photo.finished) {
        redirect(`/nudify/${params.id}/results`)
      } else {
        redirect(`/nudify/${params.id}/preferences`)
      }
    }
  },

  data: () => ({
    photo: null,
  }),

  created() {
    const { params } = this.$route
    this.photo = Nudify.getPhotoById(params.id)
  },

  methods: {
    add() {
      this.photo.add()
      this.$router.push(`/nudify/${this.photo.id}/results`)
    },

    cancel() {
      this.photo.cancel()
    },

    stop() {
      this.photo.cancel()
    },

    openFolder() {
      shell.openItem(this.photo.getFolderPath())
    },

    forget() {
      this.$router.push(`/`)
      this.photo.forget()
    },
  },
}
</script>

<style lang="scss" scoped>
.nudify {
  @apply relative flex;
  min-height: 100%;
}

.nudify__menu {
  @apply mr-4 ;
  width: 200px;

  .menu__container {
    @apply sticky;
    top: 1.5rem;
  }

  .button {
    @apply block w-full mb-6;
  }
}

.nudify__content {
  @apply flex-1 overflow-x-auto;
}
</style>

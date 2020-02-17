<template>
  <div v-if="photo" class="nudify content__body">
    <div class="nudify__menu">
      <div class="menu__container">
        <!-- Original Preview -->
        <div class="mb-6 flex justify-center">
          <app-photo :src="photo.file.path" :hover="false" data-private />
        </div>

        <!-- Navigation -->
        <div id="nudify-navigation" class="box box--items">
          <div class="box__content">
            <box-item
              label="Preferences"
              icon="sliders-h"
              :href="`/nudify/${photo.id}/preferences`" />

            <box-item
              label="Results"
              icon="heart"
              :href="`/nudify/${photo.id}/results`" />
          </div>
        </div>

        <!-- Tools -->
        <div v-if="photo.canModify" id="nudify-tools" class="box box--items">
          <div class="box__content">
            <box-item
              label="Editor"
              icon="paint-brush"
              :href="`/nudify/${photo.id}/editor`" />

            <box-item
              v-if="photo.preferences.advanced.scaleMode === 'cropjs'"
              label="Crop"
              icon="crop"
              :href="`/nudify/${photo.id}/crop`" />

            <box-item
              v-if="photo.preferences.advanced.scaleMode === 'overlay'"
              label="Overlay"
              icon="magic"
              :href="`/nudify/${photo.id}/overlay`" />
          </div>
        </div>

        <!-- Buttons -->
        <button
          v-show="!photo.running && !photo.waiting"
          id="nudify-nudify"
          v-tooltip="{content: 'Add the photo to the queue to be nudified as soon as it is turn.', placement: 'right', boundary: 'viewport'}"
          class="button button--success"
          @click.prevent="add">
          <span class="icon"><font-awesome-icon icon="play" /></span>
          <span>Nudify</span>
        </button>

        <button
          v-show="photo.finished && photo.executions > 1"
          v-tooltip="{content: 'Save all the photos generated in the location you select.', placement: 'right', boundary: 'viewport'}"
          class="button button--info"
          @click.prevent="saveAll">
          <span class="icon"><font-awesome-icon icon="save" /></span>
          <span>Save all</span>
        </button>

        <button
          v-show="photo.waiting"
          class="button button--danger"
          @click.prevent="cancel">
          <span>Remove from queue</span>
        </button>

        <button
          v-show="photo.running"
          class="button button--danger"
          @click.prevent="stop">
          <span class="icon"><font-awesome-icon icon="stop" /></span>
          <span>Stop</span>
        </button>

        <button
          id="nudify-folder"
          v-tooltip="{content: 'Open the folder where all the nudified photos are located.', placement: 'right', boundary: 'viewport'}"
          class="button"
          @click.prevent="openFolder">
          <span class="icon"><font-awesome-icon icon="folder-open" /></span>
          <span>Folder</span>
        </button>

        <button
          id="nudify-forget"
          v-tooltip="{content: 'Free memory by removing the photo from the application. (Nudified photos will not be deleted)', placement: 'right', boundary: 'viewport'}"
          class="button button--danger"
          @click.prevent="forget">
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
import { tutorial } from '~/modules'

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

  mounted() {
    tutorial.photo()
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

    saveAll() {
      this.photo.saveAll()
    },

    openFolder() {
      this.photo.openFolder()
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
  @apply relative flex pb-0;
  height: 100%;
}

.nudify__menu {
  @apply mr-4 pr-6 h-full overflow-y-auto;
  width: 250px;

.button {
    @apply block w-full mb-6;
  }
}

.nudify__content {
  @apply flex-1 h-full overflow-auto;
}
</style>

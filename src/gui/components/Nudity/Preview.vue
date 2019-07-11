<template>
  <figure class="cnudity-preview">
    <img :src="nudityPreview" :style="{ 'width': width + 'px', 'height': height + 'px' }" />
  </figure>
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
      default: 312
    },

    height: {
      type: Number,
      default: 312
    }
  },

  computed: {
    nudityPreview() {
      if (!this.$nudity.hasModelPhoto()) {
        return require('~/assets/images/d1hpv9d-e1c2c577-d272-41b0-bd73-a89209108efd.jpg')
      }

      if (this.$nudity.modelPhoto.hasOutputPhoto()) {
        return this.$nudity.modelPhoto.getOutputAsDataURL()
      }

      if (this.$nudity.modelPhoto.hasCroppedPhoto()) {
        return this.$nudity.modelPhoto.getCroppedAsDataURL()
      }

      return this.$nudity.modelPhoto.getSourceAsDataURL()
    }
  }
}
</script>

<style lang="scss">
.cnudity-preview {
  @apply flex justify-center items-center py-5;
}
</style>

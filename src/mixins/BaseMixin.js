import _ from 'lodash'
import tippy from 'tippy.js'
import { NudifyStore } from '~/modules/nudify'

export default {
  directives: {
    tooltip: {
      inserted(el, binding) {
        let settings = {}

        if (_.isString(binding.value)) {
          settings.content = binding.value
        } else {
          settings = binding.value
        }

        tippy(el, settings)
      },

    },
  },

  created() {
    window.$router = this.$router
  },

  filters: {},

  data: () => ({
    $nudify: NudifyStore,
    $settings: $provider.settings,
  }),
}

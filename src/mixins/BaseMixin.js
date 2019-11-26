import _ from 'lodash'
import tippy from 'tippy.js'
import { Nudify } from '~/modules/nudify'

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

  filters: {},

  data: () => ({
    $nudify: Nudify,
    $settings: $provider.services.settings,
  }),
}

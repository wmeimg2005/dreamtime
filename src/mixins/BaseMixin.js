import { isString } from 'lodash'
import tippy from 'tippy.js'
import { NudifyStore } from '~/modules/nudify'
import { settings } from '~/modules/system'

/**
 * @mixin
 */
export default {
  directives: {
    /**
     * v-tooltip.
     * Tooltip creation.
     */
    tooltip: {
      inserted(el, binding) {
        let options = {}

        if (isString(binding.value)) {
          options.content = binding.value
        } else {
          options = binding.value
        }

        tippy(el, options)
      },
    },
  },

  data: () => ({
    $nudify: NudifyStore,
    $settings: settings,
  }),
}

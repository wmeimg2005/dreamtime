import _ from 'lodash'
import tippy from 'tippy.js'
import { app, nudity } from '~/modules'

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
      }
    }
  },

  filters: {},

  data: () => ({
    app,

    $nudity: nudity,

    $deepTools: window.deepTools,

    $tools: window.$tools
  })
}

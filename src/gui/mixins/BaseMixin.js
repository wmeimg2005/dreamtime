import _ from 'lodash'
import tippy from 'tippy.js'
import nudity from '~/modules/nudity'

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
    app: {
      name: process.env.APP_NAME,
      version: process.env.npm_package_version,
      status: process.env.APP_STATUS
    },

    $nudity: nudity,

    $devTools: window.devTools
  })
}

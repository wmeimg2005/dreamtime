import Vue from 'vue'
import moment from 'moment'
import tippy from 'tippy.js'
import BaseMixin from '~/mixins/BaseMixin'
import { app, platform, nudity } from '~/modules'

const debug = require('debug').default('app:plugins:boot')

//
localStorage.debug = 'app:*'

// Lift off!
debug('Preparing front-end...')

// Base Mixin
Vue.mixin(BaseMixin)

// MomentJS
moment.locale('en')

// Tippy default settings
tippy.setDefaults({
  delay: 100,
  arrow: true,
  arrowType: 'round'
})

app.init()

platform.init()

export default async ({ app, $axios, router }, inject) => {
  // axios - default headers
  $axios.setHeader('X-Requested-With', 'XMLHttpRequest')

  // nudity process
  window.$nudity = nudity
  app.context.$nudity = nudity
  inject('nudity', nudity)

  // Platform info
  window.$platform = platform
  app.context.$platform = platform
  inject('platform', platform)

  // User settings
  app.context.$settings = $settings
  inject('settings', $settings)

  /* if ($settings.telemetry.enabled) {
    app.router.afterEach(to => {
      $analytics.pageview(to.path).send()
    })
  } */

  // Debug
  debug('The front-end is ready to render!', { app })
}

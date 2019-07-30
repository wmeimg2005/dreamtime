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

//
Vue.config.errorHandler = (err, vm, info) => {
  $rollbar.error(err)
}

export default async ({ app, router }, inject) => {
  debug('Enviroment', {
    env: process.env.NODE_ENV,
    rootPath: $utils.getRootPath(),
    isStatic: $utils.pack.isStatic()
  })

  $settings.init()

  await $nucleus.init()

  $rollbar.init()

  //
  // app.init()

  //
  await platform.init()

  // axios - default headers
  // $axios.setHeader('X-Requested-With', 'XMLHttpRequest')

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

  // Debug
  debug('The front-end is ready to render!', { app })
}

import _ from 'lodash'

export default function({ store, redirect, $nudity }) {
  /*
  if (!store.getters['nudity/isReady']) {
    redirect('/')
  }
  */

  if (_.isNil($nudity.modelPhoto)) {
    redirect('/')
  }
}

import _ from 'lodash'

export default function({ store, redirect }) {
  if (_.isNil(store.state.nudity.filepath)) {
    redirect('/')
  }
}

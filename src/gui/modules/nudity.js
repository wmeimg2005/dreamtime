import Vue from 'vue'
import _ from 'lodash'
import moment from 'moment'

class Nudity {
  constructor() {
    this.reset()
  }

  /**
   *
   */
  getModel() {
    return this.model
  }

  /**
   *
   * @param {*} value
   */
  setModel(value) {
    this.model = value
    return this
  }

  /**
   *
   * @param {*} value
   */
  getModelPhoto(value) {
    this.modelPhoto = value
  }

  /**
   *
   * @param {*} value
   */
  setModelPhoto(value) {
    this.modelPhoto = value
  }

  /**
   *
   */
  hasModelPhoto() {
    return !_.isNil(this.modelPhoto)
  }

  /**
   *
   * @param {*} photo
   * @param {*} model
   */
  start(photo, model = null) {
    this.setModel(model)
    this.setModelPhoto(photo)
  }

  /**
   *
   */
  reset() {
    this.model = undefined
    this.modelPhoto = undefined
  }
}

export default new Nudity()

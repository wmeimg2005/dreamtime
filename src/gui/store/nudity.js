import _ from 'lodash'

// data
export const state = () => ({
  model: undefined,
  modelPhoto: undefined
})

// computed
export const getters = {
  isReady: state => !_.isNil(state.modelPhoto)
}

export const mutations = {
  setModel(state, value) {
    state.model = value
  },

  setModelPhoto(state, value) {
    state.modelPhoto = value
  }
}

export const actions = {
  start({ commit }, { model, photo }) {
    commit('setModel', model)
    commit('setModelPhoto', photo)
  },

  reset({ commit }) {
    commit('setModel', undefined)
    commit('setModelPhoto', undefined)
  },

  setPhoto({ commit }, { filepath, fileType }) {
    commit('setFilepath', filepath)
    commit('setFileType', fileType)
    const data = window.deepTools.getFileAsDataURL(filepath)
    commit('setFileData', data)
  },

  setCroppedPhoto({ commit }, data) {
    commit('setFileCroppedData', data)
    window.deepTools.saveCroppedPhoto(data)
  }
}

import _ from 'lodash'

// data
export const state = () => ({
  filepath: undefined,
  fileType: undefined,
  fileData: undefined,
  fileCroppedData: undefined
})

// computed
export const getters = {
  // fileDataURL: state => window.deepTools.getFileAsDataURL(state.filepath)
}

export const mutations = {
  setFilepath(state, value) {
    state.filepath = value
  },

  setFileType(state, value) {
    state.fileType = value
  },

  setFileData(state, value) {
    state.fileData = value
  },

  setFileCroppedData(state, value) {
    state.fileCroppedData = value
  }
}

export const actions = {
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

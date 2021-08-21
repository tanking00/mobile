import variables from '@/styles/basicStyle.scss'

const state = {
  theme: variables.theme,
  cachedView: 'Null',
  pageLoding: false,
  hazardId: ''
}

const mutations = {
  UPD_CACHED_VIEWS: (state, view) => {
    if (view.meta.keepAlive) {
      state.cachedView = view.name
    } else if (view.meta.clearAlive) {
      state.cachedView = 'Null'
    }
  },
  SET_CACHED_VIEWS: (state, name) => {
    state.cachedView = name || 'Null'
  },
  SET_PageLoding: (state, loding) => {
    state.pageLoding = loding
  },
  SET_HazardId: (state, id) => {
    state.hazardId = id
  }
}

const actions = {
  updCachedView({ commit }, view) {
    commit('UPD_CACHED_VIEWS', view)
  },
  setCachedView({ commit }, name) {
    commit('SET_CACHED_VIEWS', name)
  },
  changePageLoding({ commit }, loding) {
    commit('SET_PageLoding', loding)
  },
  setHazardId({ commit }, id) {
    commit('SET_HazardId', id)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

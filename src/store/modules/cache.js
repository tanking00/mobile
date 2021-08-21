const state = {}

const mutations = {
  SET_CACHE: (state, { key, value }) => {
    state[key] = value
  }
}

const actions = {
  setCache({ commit }, data) {
    commit('SET_CACHE', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

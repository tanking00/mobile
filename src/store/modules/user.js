import { login, loginCp, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/storage'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    id: '', // ID
    code: '', // 工号
    name: '', // 姓名
    roles: [], // 角色
    jobs: [], // 岗位
    orgs: [], // 所有部门
    primaryOrg: {}, // 主部门
    funcPermissions: [], // 功能权限
    qualifications: [], // 资质
    userAttribute: {} // 用户其他信息
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_CODE: (state, code) => {
    state.code = code
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_JOBS: (state, jobs) => {
    state.jobs = jobs
  },
  SET_ORGS: (state, orgs) => {
    state.orgs = orgs
  },
  SET_PRIMARYORG: (state, primaryOrg) => {
    state.primaryOrg = primaryOrg
  },
  SET_FUNCPERMISSIONS: (state, funcPermissions) => {
    state.funcPermissions = funcPermissions
  },
  SET_QUALIFICATIONS: (state, qualifications) => {
    state.qualifications = qualifications
  },
  SET_USERATTRIBUTE: (state, userAttribute) => {
    state.userAttribute = userAttribute
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo)
        .then(response => {
          const { data } = response
          commit('SET_TOKEN', data)
          setToken(data)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 企业微信 login
  loginCp({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      loginCp(userInfo)
        .then(response => {
          const { data } = response
          commit('SET_TOKEN', data)
          setToken(data)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo()
        .then(response => {
          const { data } = response

          if (!data) {
            reject('Verification failed, please Login again.')
          }

          const {
            name,
            code,
            email,
            id,
            idCard,
            jobs,
            orgs,
            permissions,
            phone,
            primaryOrg,
            roles,
            qualifications
          } = data
          const userAttribute = data.userAttribute || {}

          userAttribute.email = email
          userAttribute.idCard = idCard
          userAttribute.phone = phone

          commit('SET_ID', id)
          commit('SET_CODE', code)
          commit('SET_NAME', name)
          commit('SET_ROLES', roles)
          commit('SET_JOBS', jobs)
          commit('SET_ORGS', orgs)
          commit('SET_PRIMARYORG', primaryOrg)
          commit('SET_FUNCPERMISSIONS', permissions)
          commit('SET_QUALIFICATIONS', qualifications)
          commit('SET_USERATTRIBUTE', userAttribute)

          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          removeToken() // must remove  token  first
          resetRouter()
          commit('RESET_STATE')
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

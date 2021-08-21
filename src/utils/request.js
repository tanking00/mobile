/**
 * Created by Tanking.
 * axios封装
 */

import axios from 'axios'
import { Toast, Dialog } from 'vant'
import store from '@/store'

const defaultSettings = require('@/settings')
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30 * 1000 // request timeout
})

// use cache
const CancelToken = axios.CancelToken
const source = CancelToken.source()
const expire = defaultSettings.expire

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      config.headers['Authorization'] = store.getters.token
    }
    // 判断是否需要loading
    if (config.loading) {
      // store.dispatch('settings/changePageLoding', true)
      Toast.loading({
        duration: 0,
        loadingType: 'spinner',
        forbidClick: true,
        className: 'toast-loading-transparent'
      })
    }
    // 判断是否需要缓存
    if (config.cache) {
      const cacheKey =
        config.url +
        (config.data ? JSON.stringify(config.data) : '') +
        (config.params ? JSON.stringify(config.params) : '') +
        (config.cacheKey || '')
      // 读取缓存
      const res = store.state.cache[cacheKey]
      if (res) {
        let oldTime
        if (config.needHeader) {
          oldTime = res.time
        } else {
          oldTime = res.data.time
        }
        // 判断是否过期
        const time = new Date().getTime()
        if (time - oldTime < expire) {
          config.cancelToken = source.token
          source.cancel(res)
        }
      }
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    // store.dispatch('settings/changePageLoding', false)
    Toast.clear()
    const { data } = response
    // 判断是否需要提示弹窗
    if (response.config.message && data.message) {
      Toast(data.message)
    }
    // 设置缓存
    if (response.config.cache && data.data) {
      // 缓存key默认使用url+data/params,如果有cacheKey,拼接在url后面
      const cacheKey =
        response.config.url +
        (response.config.data ? JSON.stringify(response.config.data) : '') +
        (response.config.params ? JSON.stringify(response.config.params) : '') +
        (response.config.cacheKey || '')
      // 添加当前时间
      data.time = new Date().getTime()
      // 判断是否需要请求头数据
      if (response.config.needHeader) {
        // 将数据存在store
        store.dispatch('cache/setCache', { key: cacheKey, value: response })
      } else {
        // 将数据存在store
        store.dispatch('cache/setCache', { key: cacheKey, value: data })
      }
    }
    // 判断是否需要请求头数据
    if (response.config.needHeader) {
      return response
    } else {
      return data
    }
  },
  error => {
    // store.dispatch('settings/changePageLoding', false)
    Toast.clear()
    // 走缓存在这里返回
    if (axios.isCancel(error)) {
      return Promise.resolve(error.message)
    }
    const response = error?.response || ''
    const status = response?.status || ''
    if (status === 401) {
      Dialog.confirm({
        title: '提示',
        message: response?.data?.message
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
    } else if (response && response.data && response.data.message) {
      Toast(response.data.message)
    } else {
      if (error.message.indexOf('timeout of') > -1) {
        Toast('网络连接超时！')
      } else if (error.message.indexOf('Request failed with status code 500') > -1) {
        Toast('服务器出现了错误！')
      } else {
        Toast('发生了未知错误！')
      }
    }

    return Promise.reject(error)
  }
)

export default service

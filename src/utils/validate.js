/**
 * Created by Tanking.
 * 校验规则
 * @return {boolean}
 */

// String校验
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

// Array校验
export function isArray(arr) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arr) === '[object Array]'
  }
  return Array.isArray(arr)
}

// Array不为空
export function notEmptyOfArray(arr) {
  if (arr && arr.length > 0) {
    return true
  } else {
    return false
  }
}

// String不为空
export function notEmptyOfString(str) {
  if (str) {
    return true
  } else {
    return false
  }
}

// 不为空
export function notEmpty(value, a) {
  if (value) {
    if (value === 'null') {
      return false
    }
    if (value === '[]') {
      return false
    }
    if (isArray(value) && value.length === 0) {
      return false
    }
    return true
  } else {
    return false
  }
}

// ios企业微信
export function isIosWxwork() {
  const userAgent = navigator.userAgent
  const platform = navigator.platform
  if (platform === 'iPhone' && userAgent.includes('wxwork') && window.screen.height >= 812) {
    return true
  } else {
    return false
  }
}

// 企业微信
export function isWxwork() {
  const userAgent = navigator.userAgent
  if (userAgent.includes('wxwork')) {
    return true
  } else {
    return false
  }
}

// 是否是安卓手机
export function isAndroid() {
  var u = navigator.userAgent
  if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
    return true
  } else {
    return false
  }
}

// 姓名校验规则
export function validName(str) {
  const reg = /^[\u4e00-\u9fa5A-Za-z]{2,20}$/
  return reg.test(str)
}

// 工号校验规则
export function validCode(str) {
  const reg = /^[A-Za-z0-9]{4,20}$/
  return reg.test(str)
}

// 密码校验规则
export function validPassword(str) {
  const reg = /^[A-Za-z0-9]{6,20}$/
  return reg.test(str)
}

// 手机号校验规则
export function validPhone(str) {
  const reg = /^1[0-9]{10}$/
  return reg.test(str)
}

// 身份证校验规则
export function validIdCard(str) {
  const reg = /^\d{15}|\d{18}$/
  return reg.test(str)
}

// 邮箱校验规则
export function validEmail(str) {
  const reg = /^([a-zA-Z0-9]+[_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
  return reg.test(str)
}

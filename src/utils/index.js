/**
 * Created by Tanking.
 * 公用方法
 */

import { getDictOfCode } from '@/api/global'
const defaultSettings = require('@/settings')
import router from '@/router'
import { formatTimeStamp } from '@/utils/timeFormat'
import { jssdk } from '@/api/global'
import { isWxwork } from '@/utils/validate'

// 头像地址
export const AVATARURL = process.env.VUE_APP_AVATAR_URL

/**
 * url参数解析
 * @param {string} url
 * @return {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @return {boolean}
 */
// export function hasClass(ele, cls) {
//   return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
// }

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
// export function addClass(ele, cls) {
//   if (!hasClass(ele, cls)) ele.className += ' ' + cls
// }

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
// export function removeClass(ele, cls) {
//   if (hasClass(ele, cls)) {
//     const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
//     ele.className = ele.className.replace(reg, ' ')
//   }
// }

/**
 * 查找单条节点路径
 * @param {Array} tree
 * @param {Function} func
 * @param {*} value
 * @return {Array}
 */
export function treeFindPath(tree, func, value, path = []) {
  if (!tree) return []
  for (const data of tree) {
    path.push(data.id)
    if (func(data, value)) return path
    if (data.children) {
      const findChildren = treeFindPath(data.children, func, path)
      if (findChildren.length) return findChildren
    }
    path.pop()
  }
  return []
}

/**
 * 查找多条节点路径
 * @param {Array} tree
 * @param {Function} func
 * @param {*} value
 * @return {Array}
 */
export function treeFindPaths(tree, func, value, path = [], result = []) {
  for (const data of tree) {
    path.push(data.id)
    func(data, value) && result.push([...path])
    data.childs && treeFindPaths(data.childs, func, value, path, result)
    path.pop()
  }
  return result
}

/**
 * 数组对象转数组
 * @param {Array} arr
 * @param {string} attr
 * @return {Array}
 */
export function arrObjToArr(arr, attr = 'id') {
  const res = []
  arr.forEach(item => {
    res.push(item[attr])
  })
  return res
}

/**
 * stringbool转bool
 * @param {string} attr
 * @return {boolean}
 */
export function stringToBool(str) {
  return str === 'true' || str === true
}

/**
 * 获取tree所有ID集合
 * @param {Array} tree
 * @return {Array}
 */
export function getTreeAllId(tree, ids = []) {
  for (const data of tree) {
    ids.push(data.id)
    if (data.childs) {
      getTreeAllId(data.childs, ids)
    }
  }
  return ids
}

/**
 * 根据字典code和value获取label
 * @param {Array} dict
 * @param {string|number} value
 * @return {string}
 */
export async function getDictTextOfCode(code, value) {
  if (!code || !value) {
    return ''
  }
  try {
    const res = await getDictOfCode(code)
    const { data } = res
    let label = ''
    for (const item of data) {
      if (value === item.value) {
        label = item.label
        break
      }
    }
    return label
  } catch (err) {
    return ''
  }
}

/**
 * 防抖
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * 获取页面标题
 * @param {string} pageTitle
 * @return {string}
 */
export function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${defaultSettings.title} - ${pageTitle}`
  }
  return defaultSettings.title
}

/**
 * 判断class是否存在，用于状态颜色判断
 * @param {string|number} data
 * @param {string|number|Array} value
 * @return {boolean}
 */
export function judgeHasClass(data, value) {
  if (typeof value === 'string' || typeof value === 'number') {
    if (data === value) {
      return true
    } else {
      return false
    }
  } else {
    if (value.indexOf(data) > -1) {
      return true
    } else {
      return false
    }
  }
}

/**
 * 数组拼接成字符串
 * @param {Array|String} arr
 * @param {String} connector 连接符
 * @param {String|null} attr
 * @return {string}
 */
export function arrJoinStr(arr, connector, attr) {
  if (!arr) {
    return ''
  }
  if (typeof arr === 'string') {
    arr = JSON.parse(arr)
  }
  if (attr) {
    const list = arrObjToArr(arr, attr)
    return list.join(connector)
  } else {
    return arr.join(connector)
  }
}

/**
 * 字典数据转下拉菜单数据
 * @param {Array} arr
 * @return {Array}
 */
export function dictToDropdownOption(arr) {
  const res = []
  arr.forEach(item => {
    res.push({ text: item.label, value: item.value })
  })
  return res
}

/**
 * 获取用户头像
 * @param {string||null} avatar
 * @return {string}
 */
export function getUserAvatar(avatar) {
  if (avatar) {
    return AVATARURL + '/photo/' + avatar
  } else {
    return ''
  }
}

/**
 * 深拷贝
 * @param {*} obj
 * @return {*}
 */
export function deepClone(obj) {
  let result = obj
  if (typeof obj === 'object' && obj !== null) {
    result = Object.prototype.toString.call(obj) === '[object Array]' ? [] : {}
    for (const prop in obj) {
      result[prop] = deepClone(obj[prop])
    }
  }
  return result
}

/**
 * px转化
 * @param {number} px
 * @return {number}
 */
export function pxTransform(px) {
  return (document.body.clientWidth * px) / 375
}

/**
 * 是否为true
 * @param {*} str
 * @return {boolean}
 */
export function isTrue(str) {
  if (str) {
    return true
  } else {
    return false
  }
}

/**
 * 根据字典code获取下拉菜单数据
 * @param {string} code
 * @param {bool} isAddAll
 * @return {Array}
 */
export async function getDropdownDataOfCode(code, isAddAll = true) {
  try {
    const res = await getDictOfCode(code)
    const { data } = res
    const option = dictToDropdownOption(data)
    if (isAddAll) {
      option.unshift({ text: '全部', value: '' })
    }
    return option
  } catch (err) {
    return []
  }
}

/**
 * 根据下拉菜单数据和value获取text
 * @param {Array} dict
 * @param {string|number} value
 * @return {string}
 */
export function getDictText(dict, value) {
  if (!value) {
    return ''
  }
  let res = ''
  for (const item of dict) {
    if (value === item.value) {
      res = item.text
      break
    }
  }
  return res
}

/**
 * 根据字典code获取字典数据
 * @param {string} code
 * @return {Array}
 */
export async function getDictDataOfCode(code) {
  try {
    const res = await getDictOfCode(code)
    const { data } = res
    return data
  } catch (err) {
    return []
  }
}

/**
 * 根据字典数据和value获取label
 * @param {Array} dict
 * @param {string|number} value
 * @return {string}
 */
export function getDictLabel(dict, value) {
  if (!value) {
    return ''
  }
  let res = ''
  for (const item of dict) {
    if (value === item.value) {
      res = item.label
      break
    }
  }
  return res
}

/**
 * 根据字典code和value获取label
 * @param {string} code
 * @param {string|number} value
 * @return {string}
 */
export async function getDictLabelOfCode(code, value) {
  if (!value || !code) {
    return ''
  }
  try {
    const res = await getDictOfCode(code)
    const { data } = res
    let label = ''
    for (const item of data) {
      if (value === item.value) {
        label = item.label
        break
      }
    }
    return label
  } catch (err) {
    return ''
  }
}

/**
 * 格式化tree,转为vant常用tree结构
 * @param {Array} tree
 * @return {Array}
 */
export function formatTree(tree) {
  const item = []
  tree.map((list, i) => {
    const newTree = {}
    newTree.id = list.id
    newTree.value = list.id
    newTree.text = list.name
    if (list.childs) {
      newTree.children = formatTree(list.childs)
    }
    item.push(newTree)
  })
  return item
}

/**
 * 文件类型转格式
 * @param {string} type
 * @return {string}
 */
export function fileTypeToFormat(type) {
  let res = ''
  switch (type) {
    case 'image/png':
      res = 'png'
      break
    case 'image/jpeg':
      res = 'jpg'
      break
    case 'application/pdf':
      res = 'pdf'
      break
    case 'application/vnd.ms-excel':
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      res = 'excel'
      break
    case 'application/msword':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      res = 'word'
      break
  }
  return res
}

/**
 * 数字转中文
 * @param {number|string} num
 * @return {string}
 */
export function toChinesNum(num) {
  const changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  const unit = ['', '十', '百', '千', '万']
  num = parseInt(num)
  const getWan = temp => {
    const strArr = temp
      .toString()
      .split('')
      .reverse()
    let newNum = ''
    for (var i = 0; i < strArr.length; i++) {
      if (i === 0 && strArr[i] === 0) {
        newNum = '' + newNum
      } else if (i > 0 && strArr[i] === 0 && strArr[i - 1] === 0) {
        newNum = '' + newNum
      } else {
        newNum = changeNum[strArr[i]] + (strArr[i] === 0 ? unit[0] : unit[i]) + newNum
      }
    }
    return newNum
  }
  const overWan = Math.floor(num / 10000)
  let noWan = num % 10000
  if (noWan.toString().length < 4) {
    noWan = '0' + noWan
  }
  return overWan ? getWan(overWan) + '万' + getWan(noWan) : getWan(num)
}
/**
 * 应急详情-流程处理
 * @param {Array} steps
 * @param {bool} isInvalid 是否已作废
 * @return {Object} {steps:[],stepActive:index}
 */
export function emergencySetupProcess(steps, isInvalid) {
  const currentSteps = [
    { title: '实施方案制定', time: '' },
    { title: '直属领导审核', time: '' },
    { title: '安全经理审核', time: '' },
    { title: '实施情况综述', time: '' },
    { title: '流程结束', time: '' }
  ]

  const lastObj = steps[0]
  const lastNodeName = lastObj.nodeName
  const lastOperation = lastObj.operation
  let currentIndex = 0
  if (lastNodeName === '实施方案制定') {
    if (lastOperation === '1') {
      currentIndex = 1
    }
  } else if (lastNodeName === '直属领导审核') {
    if (lastOperation === '2') {
      currentIndex = 2
    } else if (lastOperation === '3') {
      currentIndex = 0
    } else if (lastOperation === '4') {
      currentIndex = 1
    }
  } else if (lastNodeName === '安全经理审核') {
    if (lastOperation === '2') {
      currentIndex = 3
    } else if (lastOperation === '3') {
      currentIndex = 1
    } else if (lastOperation === '4') {
      currentIndex = 2
    }
  } else if (lastNodeName === '实施情况综述') {
    if (lastOperation === '1') {
      currentIndex = 4
    } else if (lastOperation === '3') {
      currentIndex = 2
    } else if (lastOperation === '4') {
      currentIndex = 3
    }
  }
  console.log('isInvalid=', isInvalid)
  var stateStr = '（进行中）'
  if (isInvalid) {
    stateStr = '（已作废）'
  }
  currentSteps.forEach((item, index) => {
    if (index < currentIndex) {
      item.time = getLastNodeTimeString(item.title, steps)
      item.title = item.title + '（已完成）'
    } else if (index === currentIndex) {
      if (item.title === '流程结束') {
        currentIndex = currentSteps.length + 1
      } else {
        item.title = item.title + stateStr
      }
    }
  })

  return { steps: currentSteps, stepActive: currentIndex }
}

export function getLastNodeTimeString(nodeName, nodes) {
  const list = nodes.filter(item => {
    return item.nodeName === nodeName
  })
  if (list.length === 0) {
    return ''
  }
  list.sort(function(a, b) {
    return b.approvalTime - a.approvalTime
  })
  var time = list[0].approvalTime
  var str = formatTimeStamp(time, 1)
  return str
}

/**
 * 判断数组项是否已存在
 * @param {Array} arr
 * @param {string|number} value
 * @param {string} attr
 * @return {string}
 */
export function judgeArrHasValue(arr, value, attr) {
  const res = arr.some(item => {
    if (item[attr] === value) {
      return true
    } else {
      return false
    }
  })
  return res
}

/**
 * js小数乘法
 * @param {string|number} arg1
 * @param {string|number} arg2
 * @return {number}
 */
export function decimalMultiplication(arg1, arg2) {
  var m = 0
  var s1 = arg1.toString()
  var s2 = arg2.toString()
  try {
    m += s1.split('.')[1].length
  } catch (e) {
    console.log(e)
  }
  try {
    m += s2.split('.')[1].length
  } catch (e) {
    console.log(e)
  }
  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m)
}

/**
 * 文件预览
 * @param {object} file
 */
export function filePreviewFun(file) {
  try {
    window.wx.previewFile({
      url: file.url, // 需要预览文件的地址(必填，可以使用相对路径)
      name: file.name, // 需要预览文件的文件名，必须有带文件格式的后缀，例如.doc(不填的话取url的最后部分，最后部分是个包含格式后缀的文件名)
      size: file.size // 需要预览文件的字节大小(必填，而且大小必须正确，否则会打开失败)
    })
  } catch (e) {
    if (isWxwork()) {
      jssdk(location.href.split('#')[0])
        .then(res => {
          const { data } = res
          window.wx.config({
            beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.appId, // 必填，企业微信的corpID
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
            jsApiList: [
              'scanQRCode',
              'previewFile',
              'invoke',
              'openDefaultBrowser',
              'closeWindow',
              'openEnterpriseChat'
            ] // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
          })
          window.wx.ready(function() {
            try {
              if (!file.url.includes('http')) {
                file.url = 'http:' + file.url
              }
              window.wx.invoke('previewFile', {
                url: file.url, // 需要预览文件的地址(必填，可以使用相对路径)
                name: file.name, // 需要预览文件的文件名，必须有带文件格式的后缀，例如.doc(不填的话取url的最后部分，最后部分是个包含格式后缀的文件名)
                size: file.size // 需要预览文件的字节大小(必填，而且大小必须正确，否则会打开失败)
              })
            } catch (e) {
              console.log(e)
              localFilePreviewFn(file)
            }
          })
        })
        .catch(err => {
          console.log(err)
          localFilePreviewFn(file)
        })
    } else {
      localFilePreviewFn(file)
    }
  }
}

/**
 * 本地文件预览
 * @param {object} file
 */
export function localFilePreviewFn(file) {
  const type = file.type.toLowerCase()
  switch (type) {
    case 'pdf':
      router.push({
        path: '/tools/pdf',
        query: { url: file.url, name: file.name }
      })
      break
    case 'docx':
    case 'doc':
      router.push({
        path: '/tools/word',
        query: { url: file.url, name: file.name }
      })
      break
    case 'xlsx':
    case 'xls':
      router.push({
        path: '/tools/excel',
        query: { url: file.url, name: file.name }
      })
      break
  }
}

/**
 * 姓名工号拼接
 * @param {string} name
 * @param {string} code
 * @return {string}
 */
export function joinNameAndCode(name, code) {
  if (name.indexOf(',') > -1) {
    const names = name.split(',')
    const codes = code.split(',')
    let res = ''
    names.forEach((item, index) => {
      if (index > 0) {
        res += ','
      }
      res += `${item}(${codes[index]})`
    })
    return res
  } else {
    return `${name}(${code})`
  }
}

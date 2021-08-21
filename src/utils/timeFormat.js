/**
 * Created by Tanking.
 * 时间格式化
 */
import moment from 'moment'

/**
 * 时间戳格式化
 * @param {TimeStamp} time
 * @param {number} type
 * @return {string}
 */
export function formatTimeStamp(time, type) {
  if (!time) {
    return ''
  }
  // time = '' + time
  // if (time.length === 10) {
  //   time = time * 1000
  // }
  // time = time * 1000
  var timeStr = time + ''
  if (timeStr.length === 10) {
    time = time * 1000
  }
  // time = time * 1
  // 返回年-月-日 时:分
  if (type === 1) {
    return moment(time).format('YYYY-MM-DD HH:mm')
  }
  // 返回年月日
  if (type === 2) {
    return moment(time).format('YYYY年MM月DD日')
  }
  // 返回年/月/日
  if (type === 3) {
    return moment(time).format('YYYY/MM/DD')
  }
  // 返回年-月-日 时:分:秒
  if (type === 4) {
    return moment(time).format('YYYY-MM-DD HH:mm:ss')
  }
  // 返回年-月-日
  if (type === 5) {
    return moment(time).format('YYYY-MM-DD')
  }
  // 返回年月日 时:分:秒
  if (type === 6) {
    return moment(time).format('YYYY年MM月DD日 HH:mm:ss')
  }
  // 返回年-月
  if (type === 7) {
    return moment(time).format('YYYY-MM')
  }
  // 返回年/月
  if (type === 8) {
    return moment(time).format('MM/DD')
  }
  return moment(time).format('YYYY-MM-DD HH:mm')
}

/**
 * 时间格式化
 * @param {string} time
 * @param {number} type
 * @return {string}
 */
export function formatTime(time, type) {
  // 返回10位时间戳
  if (type === 1) {
    return moment(time).format('X')
  }
  // 返回年-月-日
  if (type === 2) {
    return moment(time).format('YYYY-MM-DD')
  }
  // 返回年-月-日 时:分:秒
  if (type === 3) {
    return moment(time).format('YYYY-MM-DD HH:mm:ss')
  }
  return moment(time).format('YYYY-MM-DD')
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @return {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string') {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @return {string}
 */
export function formatTimes(time, option) {
  // if (('' + time).length === 10) {
  //   time = parseInt(time) * 1000
  // } else {
  //   time = +time
  // }
  time = parseInt(time) * 1000

  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

/**
 * 判断时间戳是否过期
 * @param {number} time
 * @return {boolean}
 */
export function timeStampExpire(time) {
  // time = '' + time
  // if (time.length === 10) {
  //   time = time * 1000
  // }
  time = time * 1000
  const nowTime = new Date().getTime()
  return time < nowTime
}

/**
 * 判断时间是否过期
 * @param {string} time
 * @return {boolean}
 */
export function timeExpire(time) {
  time = time.replace('-', '/')
  const timeStamp = new Date(time).getTime()
  const nowTime = new Date().getTime()
  return timeStamp < nowTime
}

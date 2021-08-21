import request from '@/utils/request'

// 消息列表
export function getMsgList(data) {
  return request({
    url: '/msgInfo',
    method: 'get',
    params: data
  })
}

// 通过id获取MsgInfo
export function getMsgInfo(id) {
  return request({
    url: '/msgInfo/' + id,
    method: 'get'
  })
}

// 清除消息
export function clearMsg(data) {
  return request({
    url: '/msgInfo/clear',
    method: 'post',
    loading: true,
    message: true,
    data
  })
}

// 已读消息
export function readMsg(data) {
  return request({
    url: '/msgInfo/read',
    method: 'post',
    loading: true,
    message: true,
    data
  })
}

// 获取未读总数
export function getMsgCountUnread(userId) {
  return request({
    url: '/msgInfo/countUnread',
    method: 'get',
    params: { userId }
  })
}

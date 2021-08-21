import request from '@/utils/request'
import qs from 'qs'
export function getTaskList(data) {
  return request({
    url: '/task',
    method: 'get',
    params: data,
    loading: true
  })
}

export function getTaskCount() {
  return request({
    url: '/task/count',
    method: 'get'
  })
}
// 获取过期任务
export function getTaskForExpired(params) {
  return request({
    url: '/task/expiredIds',
    method: 'get',
    params: params,
    paramsSerializer: params => qs.stringify(params)
  })
}

import request from '@/utils/request'

// 案例列表
export function getCaseList(data) {
  return request({
    url: '/caseCenter',
    method: 'get',
    params: data
  })
}

// 案例详情
export function getCaseDetails(id) {
  return request({
    url: '/caseCenter/' + id,
    method: 'get'
  })
}

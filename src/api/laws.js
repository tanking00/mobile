import request from '@/utils/request'

// 法律法规库
export function getLawsList(data) {
  return request({
    url: '/lawsRegulations/page',
    method: 'post',
    data
  })
}

export function getLawsDetails(data) {
  return request({
    url: '/lawsRegulations/' + data,
    method: 'get'
  })
}

// 管理制度
export function getRegimeList(data) {
  return request({
    url: '/lawsRegime/page',
    method: 'post',
    data
  })
}

export function getRegimeDetails(data) {
  return request({
    url: '/lawsRegime/' + data,
    method: 'get'
  })
}

// 适用条款
export function getClauseList(data) {
  return request({
    url: '/lawsClause/page',
    method: 'post',
    data
  })
}

export function getClauseDetails(data) {
  return request({
    url: '/lawsClause/' + data,
    method: 'get'
  })
}

// 合规性评价
export function getEvaluateList(data) {
  return request({
    url: '/lawsEvaluate/pageEvaluate',
    method: 'post',
    data
  })
}

export function getEvaluateDetails(data) {
  return request({
    url: '/lawsClause/' + data,
    method: 'get'
  })
}

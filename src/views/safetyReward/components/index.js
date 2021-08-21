import { formatTimeStamp } from '@/utils/timeFormat'

export { default as RewardDetailsView } from './rewardDetailsView'

/**
 * 业务逻辑 根据节点名称，获取最新的审批时间
 * @param {string} nodeName
 * @param {Array} nodes
 * @return {String}
 */
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

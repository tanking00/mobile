/**
 * Created by Tanking.
 * 权限判断
 */

import store from '@/store'

/**
 * 判断是否有某功能权限
 * @param {string} value
 * @return {boolean}
 */
export function checkPermission(value) {
  const permissions = store.getters.permission_funcs || []
  const res = permissions.some(item => item === value)
  return res
}

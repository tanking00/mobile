import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/storage' // get token from cookie
import { param2Obj } from '@/utils'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/loginPwd', '/oops'] // no redirect whitelist

// eslint-disable-next-line
router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  if (to.path !== '/login' && to.path !== '/') {
    store.dispatch('settings/changePageLoding', true)
  }

  // set page title
  // document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    const params = param2Obj(window.location.href)
    if (to.path === '/login' && params && params.code) {
      await store.dispatch('user/resetToken')
      // next(`/login?redirect=${to.path}`)
      next()
    } else if (whiteList.indexOf(to.path) !== -1) {
      // 如果已登录，重定向到主页

      next({ path: '/' })
      NProgress.done()
    } else {
      // 确定用户是否通过getInfo获取了用户信息
      const hasId = store.getters.id
      if (hasId) {
        if (to.meta?.noPower) {
          next({ path: '/401' })
        } else {
          next()
        }
      } else {
        try {
          // get user info
          const info = await store.dispatch('user/getInfo')
          const permissions = info.permissions || []

          // 获取路由
          const accessRoutes = await store.dispatch('permission/generateRoutes', permissions)
          // dynamically add accessible routes
          router.addRoutes(accessRoutes)
          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (err) {
          console.log(err)
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          // next(`/login?redirect=${to.path}`)
          next('/oops')
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (to.path === '/loginPwd' && process.env.VUE_APP_ENV === 'production') {
      next('/oops')
      NProgress.done()
    } else if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      // next(`/login?redirect=${to.path}`)
      next('/oops')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  store.dispatch('settings/changePageLoding', false)
  NProgress.done()
  document.getElementById('app').scrollTop = 0
})

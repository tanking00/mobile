module.exports = {
  // 页面标题
  title: '卡斯柯',
  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: ['production', 'development'],
  // api缓存有效期（刷新页面自动清除）
  expire: 1000 * 60 * 2
}

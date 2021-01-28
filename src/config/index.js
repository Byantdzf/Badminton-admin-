export default {
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 1,
  /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  useI18n: false,
  /**
   * @description api请求基础路径
   */
  baseUrl: {
    // dev: 'http://love.hankin.ufutx.cn/api/', // 本地环境
    // dev: 'http://wlj.test/api/',
    dev: 'https://www.efclub.top/api/admin/',
    alpha: 'https://www.efclub.top/api/admin/', // alpha测试环境
    pro: 'https://www.efclub.top/api/admin/' // 线上环境
  }
}

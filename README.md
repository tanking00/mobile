# 卡斯柯企业微信端 H5

## 下载运行

```bash
# 克隆项目
git clone http://192.168.2.30/casco/casco-mobile.git

# 进入项目目录
cd casco-mobile

# 安装依赖
yarn install
npm install

# 本地运行
yarn dev
npm run dev
```

## 打包

```bash
# 开发环境(宝曼内部测试环境)打包
yarn build:stage
npm run build:stage

# 预发布环境(客户测试环境)打包
yarn build:pre
npm run build:pre

# 生产环境(客户生产环境)打包
yarn build:prod
npm run build:prod
```

## lib 目录结构

```shell
lib
├── api --- 接口请求文件目录
├── assets  --- 静态资源文件目录
├── components  --- 组件文件目录
	├── Global  --- 全局组件文件目录
	└── index  --- 批量导出组件文件
├── router  --- 路由文件目录
├── store --- 状态管理文件目录
├── styles  --- 样式文件目录
	├── basicStyle.scss --- 基础样式文件
	├── commonClass.scss  --- 常用class文件
	├── defaultStyle.scss  --- 默认样式文件
	├── index.scss  --- 样式主文件
	├── reset.scss  --- 重置默认样式文件
	└── vant-variables.less --- vantUI主题修改文件
├── utils --- 公用方法文件目录
	├── enum.js --- 公用枚举文件
	├── error-log.js --- 错误日志文件
	├── index.js  --- 公用方法文件
	├── permission.js --- 权限判断文件
	├── request.js  --- axios封装文件
	├── storage.js --- cookie存储方法文件
	├── timeFormat.js --- 时间格式化文件
	└── validate.js --- 校验规则文件
├── views --- 模块页面文件目录
├── App.vue --- 页面入口文件
├── main.js --- 项目入口文件
├── permission.js --- 权限控制文件
└── settings.js --- 全局变量设置文件
```

## 规范

#### 1. 使用 eslint+prettier 规范代码

#### 2. 使用 basicStyle 变量

```scss
@import '~@/styles/basicStyle.scss';
.class {
  color: $color-primary;
  font-size: $font-size-m;
}
```

#### 3. 使用 commonClass

```html
<van-icon name="bm-biaoqing" class="icon-size-18 color-primary" />
<span class="color-text-primar font-size-ml margin-left-8">文字</span>
// 单个使用用 commonClass，多个使用用 class 配合 basicStyle 变量
```

#### 4. 使用 iconfont

```html
<van-button icon="bm-biaoqing" type="primary">按钮</van-button>
<van-icon name="bm-biaoqing" />
<i class="van-icon-bm-biaoqing"></i>
```

#### 5. 使用 api 自定义参数

```js
// message、cache、cacheKey、needHeader为自定义属性，默认不传
export function getXxx(data) {
  return request({
    url: '/xxx/xxx',
    method: 'get',
    params: data,
    loading: true, // 是否需要loading,默认false,为true时会有loading
    message: true, // 请求成功是否弹窗,默认false,为true时请求成功会有弹窗提示
    cache: true, // 是否需要缓存,默认false,为true时开启缓存
    cacheKey: '', // 缓存预留字段,防止url重复,默认为空
    needHeader: true // 默认false,返回response.data,为true时,返回整个response
  })
}
```

#### 6. 路由 meta 自定义参数

```js
title: '安全责任制',  // 页面标题，van-nav-bar的title
key: 'basic:duty', // 功能权限，默认有权限
keepAlive: true, // 页面是否需要缓存，默认不缓存
clearAlive: true // 是否清除页面缓存，默认不清除
```

#### 7. 必须用到的 class 介绍

```txt
container: 页面最外层div必须要, 组件不需要
container-supports: 带底部菜单和列表页不需要，其他的页面最外层div需要，处理底部小黑条
submit-button-height：使用SubmitButton组件，并且position为fixed(默认)，最外层div必须要，用来填充底部，不需要container-supports
refresh-min-height-m(系列)：van-pull-refresh、EmptyList组件必须要，用来撑满最小高度
```

#### 8. 常用全局函数

```txt
判断权限: this.$checkPermission(key) key为权限码
文件预览: this.$filePreviewFun(file) file为文件对象
```

## 组件使用手册 | [USECOMPONENTS.md](./USECOMPONENTS.md)

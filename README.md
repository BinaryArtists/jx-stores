
轻量级状态管理框架，有以下核心特点：

## 安装

依赖了 React@16.8.0+ 提供的 Hooks 特性，因此只支持 React 16.8.0 及以上版本。

```bash
$ npm i -S jx-stores
```

## Features

* **极简 API**：只有 5 个 API，简单上手，使用方便，不需要学习 Redux 里的各种概念。
* **React Hooks**：拥抱 Hooks 的使用体验，同时也是基于 React Hooks 实现。
* **集成异步状态**：记录异步 action 的执行状态，简化 view 组件中对于 loading 与 error 状态的渲染逻辑。
* **性能优化**：通过多 store 的去中心化设计，减少单个 state 变化触发重新渲染的组件个数，从而减少不必要的渲染。
* **单向数据流**：与 Redux 一样使用单向数据流，便于状态的追踪与预测。

## 快速开始

* 请参考 /examples

## 实现原理

`icestore` 数据流示意图如下：

<img src="https://user-images.githubusercontent.com/5419233/60956252-012f9300-a335-11e9-8667-75490ceb62b1.png" width="400" />

## 最佳实践

### 目录结构组织

对于大多数的中小型项目，推荐将项目所有 store 集中管理在 `src/stores/` 目录下：

```bash
├── src/
│   ├── components/
│   │   └── NotFound/
│   ├── pages/
│   │   └── Home
│   ├── stores/
│   │   ├── storeA.js
│   │   ├── storeB.js
│   │   ├── storeC.js
│   │   └── index.js
```

如果项目比较庞大或者更倾向于 store 跟随页面维护，那么可以在每个 page 目录都声明一个 store 示例，但是这种情况建立尽量避免跨页面的 store 调用。

### 尽可能小的拆分 store

从 `icestore` 的内部设计来看，当某个 store 的 state 发生变化时，所有使用 useStore 监听 store 变化的 view 组件都会触发重新渲染，这意味着一个 store 中存放的 state 越多越可能触发更多的 view 组件重新渲染。因此从性能方面考虑，建议按照功能划分将 store 拆分成一个个独立的个体。

### 不要滥用 `icestore`

从工程的角度来看，store 中应该只用来存放跨页面与组件的状态。将页面或者组件中的内部状态放到 store 中将会破坏组件自身的封装性，进而影响组件的复用性。对于组件内部状态完全可以使用 useState 来实现，因此如果上面的 todo app 如果是作为工程中的页面或者组件存在的话，使用 useState 而不是全局 store 来实现才是更合理的。

## API

### use

将 store 配置注释到全局 store 实例。

* 参数
  - namespace {string} store 的命名空间
  - bindings {object} store 配置，包含 state 和 actions
* 返回值
  - {object} store 实例

### mix

给所有 store 或者指定 namespace 的 store 注册 middleware，如果不指定第 2 个参数，给所有 store 注册 middleware，如果指定第 2 个参数，则给指定 namespace 的 store 注册 middleware，详细用法见[注册方式](#注册方式)

* 参数
  - middlewares {array} 待注册的 middleware 数组
  - namespace {string} store 的命名空间
* 返回值
  - 无

### useStores

同时使用多个 store 的 hook。

* 参数
  - namespaces {array} 多个 store 的命名空间数组
* 返回值
  - {array} 多个 store 的配置对象数组

### useStore

使用单个 store 的 hook。

* 参数
  - namespace {string} store 的命名空间
* 返回值
  - {object} store 的配置对象

### getState

获取单个 store 的最新 state 对象。

* 参数
  - namespace {string} store 的命名空间
* 返回值
  - {object} store 的 state 对象

## 高级用法

### 异步 action 执行状态

`icestore` 内部集成了对于异步 action 的异步状态记录，方便用户在不增加额外的 state 的前提下访问异步 action 的执行状态（loading 与 error），从而使状态的渲染逻辑更简洁。

#### API

* `action.loading` - action 是否正在执行中的标志位
  - Type: {boolean}
  - Default: false
* `action.error` - action 执行完成后如果有错误发生返回的错误对象
  - Type: {object}
  - Default: null
* `action.disableLoading` - 是否关闭 action loading 效果的开关, 如果设置为 true, 当 loading 标志位变化时，关联的 view 组件将不会重新渲染
  - Type: {boolean}
  - Default: false
* `store.disableLoading` - 是否全局关闭所有 action 的 loading 效果. 注意当全局与 action 上的该标志位均设置时，action 上标志位优先级高
  - Type: {boolean}
  - Default: false

### 中间插件

#### 背景

如果你有使用过服务端的框架如 Express 或者 koa，应该已经熟悉了中间件的概念，在这些框架中，中间件用于在框架 `接收请求` 与 `产生响应` 间插入自定义代码，这类中间件的功能包含在请求未被响应之前对数据进行加工、鉴权，以及在请求被响应之后添加响应头、打印 log 等功能。


在状态管理领域，Redux 同样实现了中间件的机制，用于在 `action 调用` 与 `到达 reducer` 之间插入自定义代码，中间件包含的功能有打印 log、提供 thunk 与 promise 异步机制、日志上报等。


icestore 支持中间件的目的与 Redux 类似，也是为了在 action 调用前后增加一种扩展机制，增加诸如打印 log、埋点上报、异步请求封装等一系列能力，不同的是 icestore 已支持异步机制，因此不需要额外通过中间件方式支持。

### 中间件 API

在中间件 API 的设计上，`icestore` 借鉴了 koa 的 API，见如下：

```javascript
async (ctx, next) =>  {
  // action 调用前逻辑

  const result = await next();

  // action 调用后逻辑

  return result;
}
```

如果用户定义的 action 中有返回值，中间件函数必须将下一个中间件的执行结果返回，以保证中间件链式调用完成后能拿到 action 的返回值。

#### ctx API

对于中间件函数的第一个 ctx 参数，从上面能拿到当前的 store 与当前调用 action 的信息，ctx 对象中包含的详细参数如下：

* ctx.action - 当前调用的 action 对象
  * 类型：{object}
  * 默认值：无
* ctx.action.name - 当前调用的 action 方法名
  * 类型：{string}
  * 默认值：无
* ctx.action.arguments - 当前调用的 action 方法参数数组
  * 类型：{array}
  * 默认值：无
* ctx.store - 当前 store 对象
  * 类型：{object}
  * 默认值：无
* ctx.store.namespace - 当前 store 的 namespace
  * 类型：{string}
  * 默认值：无
* ctx.store.getState - 获取当前 store 最新 state 的方法
  * 类型：{function}
  * 参数：无

调用方式如下：

```javascript
const {
  action, // 当前调用的 action 对象
  store, // 当前 store 对象
} = ctx;

const {
  name, // 当前调用的 action 方法名
  arguments, // 当前调用的 action 方法参数数组
} = action;

const { 
  namespace,  // 当前 store namespace
  getState, // 获取当前 store state 方法
} = store;
```

### 注册方式

由于 `icestore` 的多 store 设计，`icestore` 支持给不同的 store 单独注册 middleware，
方式如下：

1. 全局注册 middleware  
  *  全局注册的 middleware 对所有 store 生效

	```javascript
	import Icestore from '@ice/store';
	const stores = new Icestore();
	stores.applyMiddleware([a, b]);
	```

2. 指定 store 注册 middleware  
  * store 上最终注册的 middleware 将与全局注册 middleware 做合并

	```javascript
	stores.applyMiddleware([a, b]); 
	stores.applyMiddleware([c, d], 'foo'); // store foo 中间件为 [a, b, c, d]
	stores.applyMiddleware([d, c], 'bar'); // store bar 中间件为 [a, b, d, c]
	```

## 调试

icestore 官方提供 logger 中间件，可以方便地跟踪触发 action 名以及 action 触发前后 state 的 diff 信息，提升问题排查效率。

### 使用方式

在注册 store 之前，使用 `applyMiddleware` 方法将 logger 中间件加入到中间件队列中

```javascript
import todos from './todos';
import Icestore from '@ice/store';
import logger from '@ice/store-logger';

const icestore = new Icestore();

const middlewares = [];

// 线上环境不开启调试中间件
if (process.env.NODE_ENV !== 'production') {
  middlewares.push(logger);
}

icestore.mix(middlewares);
icestore.use('todos', todos);
```

注册成功后，当 `store` 中的 action 被调用时，在浏览器的 DevTools 中将能看到实时的日志：

<img src="https://user-images.githubusercontent.com/5419233/63344463-13184300-c383-11e9-96da-2de3b41f6e9b.png"  width="250" />

日志中包含以下几个部分：

* Store Name: 当前子 store 对应的 namespace
* Action Name: 当前触发的 action 名
* Added / Deleted / Updated: state 变化的 diff
* Old state: 更新前的 state
* New state: 更新后的 state

#### 示例

```javascript
describe('todos', () => {
  test('refresh data success', async () => {
    await todos.refresh();
    expect(todos.dataSource).toEqual([
      {
        name: 'react'
      },
      {
        name: 'vue',
        done: true
      },
      {
        name: 'angular'
      }
    ]);
  });
});
```

完整的测试用例请参考上面[sandbox](https://codesandbox.io/s/icestore-hs9fe)中的 `todos.spec.js` 文件。
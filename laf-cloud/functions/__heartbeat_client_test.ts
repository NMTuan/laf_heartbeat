/*
 * @Author: NMTuan
 * @Email: NMTuan@qq.com
 * @Date: 2023-07-18 09:29:53
 * @LastEditTime: 2023-07-18 16:55:07
 * @LastEditors: NMTuan
 * @Description:
 * @FilePath: \laf_heartbeat\laf-cloud\functions\__heartbeat_client_test.ts
 */
import cloud from '@lafjs/cloud'

const heartBeatConfig = {
    serverUrl: '',
    serverKey: ''
}

interface Action {
    [key: string]: {
        methods: ('GET' | 'POST')[]
        auth: boolean
        handler: Function
    }
}

// 配置项
const config = {
    name: 'laf_heartbeat_c_test', // 当前应用名称
    collectionPrefix: 'laf_heartbeat_c_test', // 数据库前缀
    sharedPrefix: 'laf_heartbeat_c_test' // 全局缓存前缀
}

// 统一数据库集合的名称
// 使用 collection('user') 访问数据库时，则会去访问 firefly_user 数据集合。
// 保证各项目之间数据库独立，且不容易混淆。
const collection = (name) => {
    if (name) {
        return cloud.database().collection(`${config.collectionPrefix}_${name}`)
    } else {
        return cloud.database().collection(`${config.collectionPrefix}`)
    }
}

// 统一缓存前缀
// 同样保证各项目之间缓存独立，不易混淆。
const shared = {
    get(key) {
        return cloud.shared.get(`${config.sharedPrefix || ''}_${key}`)
    },
    set(key, value) {
        return cloud.shared.set(`${config.sharedPrefix || ''}_${key}`, value)
    }
}

const actions: Action = {}

// 获取 key
actions.getKey = {
    methods: ['GET'],
    auth: false,
    async handler(ctx) {
        return {
            code: 20000,
            data: {
                key: heartBeatConfig.serverKey
            }
        }
    }
}

// 发送心跳
export const heartBeat = async () => {
    if (!heartBeatConfig.serverUrl || !heartBeatConfig.serverKey) {
        console.log('heartBeat error: no set heartBeatConfig')
        return
    }

    const sended = await cloud.fetch({
        url: heartBeatConfig.serverUrl,
        params: {
            action: 'receive',
            key: heartBeatConfig.serverKey
        }
    })
    if (sended.code !== 20000) {
        console.log('heartBeat error: server receive error', sended.message)
    }
    return sended.data
}

// 用接口模拟定时器，仅测试用
// actions.heartBeat = {
//     methods: ['GET'],
//     auth: false,
//     handler: heartBeat
// }

// 入口，拦截器
export default async function (ctx: FunctionContext) {
    const { action } = ctx.query

    // 黑名单处理和访问频率处理，此处省去。见帖子：https://forum.laf.run/d/130/7
    // 顺便说一下，黑名单的处理可以放在`__interceptor__`中，这里仅处理频率问题即可。

    // 没有 action 或没找到 action 报错
    if (!action || !actions[action]) {
        return { code: 40000 }
    }

    const { methods, auth, handler } = actions[action]

    // method 不符
    if (!methods.includes(ctx.method)) {
        return { code: 40000 }
    }

    // 鉴权
    if (auth && ctx.user === null) {
        return { code: 40100 }
    }

    // 执行
    if (handler) {
        return handler(ctx)
    }

    // 能执行到这里肯定哪儿写错了
    return { code: 50000 }
}

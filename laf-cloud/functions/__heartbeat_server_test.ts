import cloud from '@lafjs/cloud'

interface Action {
    [key: string]: {
        methods: ('GET' | 'POST')[]
        auth: boolean
        handler: Function
    }
}

const heartBeatConfig = {
    max: 10 // 最大接入数量
}

// 配置项
const config = {
    name: 'laf_heartbeat_s_test', // 当前应用名称
    collectionPrefix: 'laf_heartbeat_s_test', // 数据库前缀
    sharedPrefix: 'laf_heartbeat_s_test' // 全局缓存前缀
}

// 统一数据库集合的名称
// 使用 collection('user') 访问数据库时，则会去访问 firefly_user 数据集合。
// 保证各项目之间数据库独立，且不容易混淆。
const collection = (name?: string) => {
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

// 获取 client 信息
actions.fetch = {
    methods: ['POST'],
    auth: false,
    async handler(ctx) {
        const { clientUrl } = ctx.body
        if (!clientUrl) {
            return { code: 40000 }
        }
        const item = await collection()
            .where({
                clientUrl
            })
            .getOne()
        // 存在则返回整个数据
        if (item.data !== null) {
            return {
                code: 20000,
                data: item.data
            }
        } else {
            return {
                code: 40000
            }
        }
    }
}

// 注册 client 信息
actions.signup = {
    methods: ['POST'],
    auth: false,
    async handler(ctx) {
        const { clientUrl } = ctx.body
        if (!clientUrl) {
            return { code: 40000 }
        }

        // 先检查数据库是否已存在
        const exits = await collection()
            .where({
                clientUrl
            })
            .getOne()
        // 存在则返回整个数据
        if (exits.data !== null) {
            return {
                code: 20000,
                data: exits.data
            }
        }

        // 检查是否超出数据总量
        const { total } = await collection().count()
        if (total >= heartBeatConfig.max) {
            return {
                code: 40000,
                message: 'The maximum number of clients has been exceeded'
            }
        }

        // 不存在则随机生成key，并插入新数据
        const key = (Date.now() * Math.random()).toString(36)
        const inserted = await collection().add({
            key, // 认证key
            clientUrl, // 客户端地址
            sendUrl: '', // 发送通道
            errorMax: 3, // 最大异常次数
            errorCount: 0, //当前异常次数
            noticeMax: 3, // 最大通知次数
            noticeCount: 0, // 当前通知次数
            state: 0, // 0未激活 1已激活-待生效 2已生效
            paused: 0, //是否暂停服务 1暂停 0正常
            createdAt: Date.now(), // 创建时间
            updatedAt: Date.now() // 更新时间
        })
        // 最后把整个数据返回
        const item = await collection().doc(inserted.id).get()
        return {
            code: 20000,
            data: item.data
        }
    }
}

// 激活 client 信息
actions.active = {
    methods: ['POST'],
    auth: false,
    async handler(ctx) {
        const { id } = ctx.body
        if (!id) {
            return { code: 40000 }
        }
        try {
            const item = await collection().doc(id).get()
            if (item.data === null) {
                return {
                    code: 40000,
                    message: 'not found'
                }
            }
            if (item.data.state !== 0) {
                return {
                    code: 20000,
                    message: 'No need to activate again'
                }
            }
            const { data: client } = await cloud.fetch({
                url: item.data.clientUrl,
                params: {
                    action: 'getKey'
                }
            })
            if (client.code !== 20000) {
                return { code: 50000 }
            }
            if (item.data.key !== client.data.key) {
                return { code: 40000, message: 'The client key is incorrect' }
            }
            const updated = await collection().doc(item.data._id).update({
                state: 1
            })
            return {
                code: 20000,
                data: {
                    ...item.data,
                    state: 1
                }
            }
        } catch (err) {
            return {
                code: 50000,
                message: err.message
            }
        }

        // return new Promise(async (resolve, reject) => {
        //     if (!id) {
        //         return resolve({ code: 40000 })
        //     }
        //     // 先查状态
        //     collection()
        //         .doc(id)
        //         .get()
        //         .then(({ data }) => {
        //             if (data.state !== 0) {
        //                 return resolve({
        //                     code: 20000,
        //                     message: '已激活'
        //                 })
        //           }
        //           // 获取 client 的 key
        //             return cloud.fetch({
        //                 url: data.clientUrl,
        //                 params: {
        //                     action: 'getKey'
        //                 }
        //             })
        //         })
        //         .then((res) => {
        //             if (res.code !== 20000 || !res.data.serverKey) {
        //                 resolve({ code: 50000 })
        //           }
        //           if()
        //             const key = res.data.serverKey
        //         })
        //         .catch((err) => {
        //             return resolve({
        //                 code: 50000,
        //                 message: err
        //             })
        //         })

        // cloud
        //     .fetch({
        //         url: clientUrl,
        //         params: {
        //             action: 'getKey'
        //         }
        //     })
        //     .then((res) => {
        //         if (res.code !== 20000 || !res.data.serverKey) {
        //             resolve({ code: 50000 })
        //         }
        //         const key = res.data.serverKey
        //     })
        //     .catch((err) => {
        //         return resolve({
        //             code: 50000,
        //             message: err
        //         })
        //     })
        // })
    }
}

// 切换 paused 状态
actions.toggle = {
    methods: ['POST'],
    auth: false,
    async handler(ctx) {
        const { id } = ctx.body
        if (!id) {
            return { code: 40000 }
        }
        const toggled = await collection()
            .doc(id)
            .update({
                $bit: {
                    paused: {
                        xor: 1
                    }
                }
            })

        if (!toggled.ok) {
            return { code: 50000 }
        }
        const item = await collection().doc(id).get()
        return {
            code: 20000,
            data: item.data
        }
    }
}

// 删除
actions.remove = {
    methods: ['POST'],
    auth: false,
    async handler(ctx) {
        const { id } = ctx.body
        if (!id) {
            return { code: 40000 }
        }
        const removed = await collection().doc(id).remove()
        if (!removed.ok) {
            return { code: 50000 }
        }
        return { code: 20000 }
    }
}

// 更新配置
actions.update = {
    methods: ['POST'],
    auth: false,
    async handler(ctx) {
        const { id, payload } = ctx.body
        if (!id) {
            return { code: 40000 }
        }
        const allowKeys = ['sendUrl', 'errorMax', 'noticeMax']
        const params = allowKeys.reduce((total, key) => {
            if (payload[key] !== undefined) {
                total[key] = payload[key]
            }
            return total
        }, {})
        const updated = await collection().doc(id).update(params)
        if (!updated.ok) {
            return { code: 50000 }
        }
        const item = await collection().doc(id).get()

        return {
            code: 20000,
            message: 'updated',
            data: item.data
        }
    }
}

// 接收心跳
actions.receive = {
    methods: ['GET'],
    auth: false,
    async handler(ctx) {
        const { key } = ctx.query
        if (!key) {
            return {
                code: 40000,
                message: 'missing parameter'
            }
        }
        const updated = await collection()
            .where({
                key
            })
            .update({
                errorCount: 0, // 重置计数器
                noticeCount: 0, // 重置计数器
                state: 2, // 更新状态为：已生效
                updatedAt: Date.now() // 更新更新时间
            })
        return {
            code: 20000,
            data: updated
        }
    }
}

// 定时任务
export const schedule = async () => {
    // 找到需要发通知的数据
    const noticeItems = await collection()
        .where({
            $and: [
                { state: 2 },
                { paused: 0 },
                {
                    sendUlr: {
                        $ne: ''
                    }
                },
                // errorCount >= errorMax
                {
                    $expr: {
                        $gte: ['$errorCount', '$errorMax']
                    }
                },
                // noticeCount < noticeMax
                {
                    $expr: {
                        $lt: ['$noticeCount', '$noticeMax']
                    }
                },
                {
                    updatedAt: {
                        $lt: Date.now() - 60 * 1000
                    }
                }
            ]
        })
        .get()

    // 所有需要发通知的 noticeCount++
    const noticeItemInc = await collection()
        .where({
            $and: [
                { state: 2 },
                { paused: 0 },
                {
                    sendUlr: {
                        $ne: ''
                    }
                },
                // errorCount >= errorMax
                {
                    $expr: {
                        $gte: ['$errorCount', '$errorMax']
                    }
                },
                // noticeCount < noticeMax
                {
                    $expr: {
                        $lt: ['$noticeCount', '$noticeMax']
                    }
                },
                {
                    updatedAt: {
                        $lt: Date.now() - 60 * 1000
                    }
                }
            ]
        })
        .update({
            $inc: {
                noticeCount: 1
            }
        })

    // 所有异常的 errorCount++
    const errorItemInc = await collection()
        .where({
            $and: [
                { state: 2 },
                { paused: 0 },
                {
                    sendUlr: {
                        $ne: ''
                    }
                },
                // errorCount < errorMax
                {
                    $expr: {
                        $lt: ['$errorCount', '$errorMax']
                    }
                },
                { noticeCount: 0 },
                {
                    updatedAt: {
                        $lt: Date.now() - 60 * 1000
                    }
                }
            ]
        })
        .update({
            $inc: {
                errorCount: 1
            }
        })

    // 发通知
    noticeItems.data.map((item) => {
        cloud.fetch(item.sendUrl)
    })
    return {
        code: 20000,
        data: noticeItems.data
    }
}

// 用接口模拟定时器，仅测试用
// actions.schedule = {
//     methods: ['GET'],
//     auth: false,
//     handler: schedule
// }

// 获取服务器数据
actions.getInfo = {
    methods: ['GET'],
    auth: false,
    async handler() {
        const count = await collection().count()
        const active = await collection()
            .where({
                state: {
                    $in: [1, 2]
                }
            })
            .count()
        return {
            code: 20000,
            data: {
                active: active.total, // 激活和生效的数据
                count: count.total, // 总数据条数
                max: heartBeatConfig.max // 最大接入数量
            }
        }
    }
}

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

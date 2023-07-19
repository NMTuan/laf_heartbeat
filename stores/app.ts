/*
 * @Author: NMTuan
 * @Email: NMTuan@qq.com
 * @Date: 2023-07-19 15:12:14
 * @LastEditTime: 2023-07-19 17:39:50
 * @LastEditors: NMTuan
 * @Description:
 * @FilePath: \laf_heartbeat\stores\app.ts
 */
import { defineStore } from 'pinia'

interface Server {
    url?: string
    active?: number
    count?: number
    max?: number
    delay?: number
}

interface Client {
    _id?: string
    clientUrl?: string
    key?: string
    createdAt?: number
    updatedAt?: number
    sendUrl?: string
    paused?: 0 | 1
    state?: 0 | 1 | 2
    noticeCount?: number
    noticeMax?: number
    errorCount?: number
    errorMax?: number
}

export const useAppStore = defineStore('useAppStore', () => {
    // 服务端信息
    const server: Ref<Server> = ref({})
    // 客户端信息
    const client: Ref<Client> = ref({})

    // 获取服务端信息
    const getServerInfo = (url: string, loading?: Ref<boolean>) => {
        const startTime = Date.now()
        return new Promise((resolve, reject) => {
            request(
                {
                    url,
                    query: {
                        action: 'getInfo'
                    }
                },
                loading
            )
                .then((res) => {
                    if (res.code === 20000) {
                        server.value = {
                            ...res.data,
                            url,
                            delay: Date.now() - startTime
                        }
                    }
                    resolve(res)
                })
                .catch((err: Error) => {
                    reject(err)
                })
        })
    }

    // 查询客户端注册状态
    const checkClientState = (url: string, loading?: Ref<boolean>) => {
        return new Promise((resolve, reject) => {
            request(
                {
                    url: server.value.url,
                    method: 'post',
                    query: {
                        action: 'fetch'
                    },
                    body: {
                        clientUrl: url
                    }
                },
                loading
            )
                .then((res) => {
                    if (res.code === 20000) {
                        client.value = res.data
                    }
                    resolve(res)
                })
                .catch((err: Error) => {
                    reject(err)
                })
        })
    }

    // 注册客户端
    const signupClient = (url: string) => {
        return new Promise((resolve, reject) => {
            request({
                url: server.value.url,
                method: 'post',
                query: {
                    action: 'signup'
                },
                body: {
                    clientUrl: url
                }
            })
                .then((res) => {
                    if (res.code === 20000) {
                        client.value = res.data
                    }
                    resolve(res)
                })
                .catch((err: Error) => {
                    reject(err)
                })
        })
    }

    // 激活客户端
    const activeClient = (loading?: Ref<boolean>) => {
        return new Promise((resolve, reject) => {
            request(
                {
                    url: server.value.url,
                    method: 'post',
                    query: {
                        action: 'active'
                    },
                    body: {
                        id: client.value._id
                    }
                },
                loading
            )
                .then((res) => {
                    if (res.code === 20000) {
                        client.value = res.data
                    }
                    resolve(res)
                })
                .catch((err: Error) => {
                    reject(err)
                })
        })
    }

    // 更新客户端配置
    const updateClient = (
        payload: { [key: string]: any },
        loading?: Ref<boolean>
    ) => {
        return new Promise((resolve, reject) => {
            request(
                {
                    url: server.value.url,
                    method: 'post',
                    query: {
                        action: 'update'
                    },
                    body: {
                        id: client.value._id,
                        payload
                    }
                },
                loading
            )
                .then((res) => {
                    if (res.code === 20000) {
                        client.value = res.data
                    }
                    resolve(res)
                })
                .catch((err: Error) => {
                    reject(err)
                })
        })
    }

    // 切换paused状态
    const togglePaused = (loading?: Ref<boolean>) => {
        return new Promise((resolve, reject) => {
            request(
                {
                    url: server.value.url,
                    method: 'post',
                    query: {
                        action: 'toggle'
                    },
                    body: {
                        id: client.value._id
                    }
                },
                loading
            )
                .then((res) => {
                    if (res.code === 20000) {
                        client.value = res.data
                    }
                    resolve(res)
                })
                .catch((err: Error) => {
                    reject(err)
                })
        })
    }
    return {
        server,
        client,
        getServerInfo,
        checkClientState,
        signupClient,
        activeClient,
        updateClient,
        togglePaused
    }
})

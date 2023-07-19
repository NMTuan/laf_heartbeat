<!--
 * @Author: NMTuan
 * @Email: NMTuan@qq.com
 * @Date: 2023-07-19 09:40:32
 * @LastEditTime: 2023-07-19 17:50:49
 * @LastEditors: NMTuan
 * @Description: 
 * @FilePath: \laf_heartbeat\pages\index.vue
-->
<template>
    <NuxtLayout>
        <h1 class="text-center mb-10 ml-6.5 flex items-center justify-center">
            <span>Laf x HeartBeat</span>
            <sup><i class="block i-ri-question-line text-lg mb-8 ml-2 text-gray-400 cursor-pointer"></i></sup>
        </h1>
        <div class="w-640px mx-auto relative">
            <Transition>
                <StepServerUrl v-if="!appStore.server.url"></StepServerUrl>
                <StepClientUrl v-else-if="!appStore.client._id"></StepClientUrl>
                <StepState0 v-else-if="appStore.client.state === 0"></StepState0>
                <StepState2 v-else-if="[1, 2].includes(appStore.client.state)"></StepState2>
            </Transition>
        </div>
        <template v-if="0">
            <!-- <div class="w-640px mx-auto">
                <el-input v-model="serverUrl" :disabled="serverInfo.url" size="large"
                    placeholder="Please enter the server url">
                    <template #append>
                        <div v-if="serverInfo.url" class="flex gap-4">
                            <span>delay: {{ serverInfo.delay }}ms</span>
                            <span>active: {{ serverInfo.active }}</span>
                            <span>count: {{ serverInfo.count }}</span>
                            <span>max: {{ serverInfo.max }}</span>
                        </div>
                        <el-button v-else :loading="serverLoading" @click="submitServerUrl">Enter</el-button>
                    </template>
                </el-input>
            </div> -->
            <!-- <div class="w-640px mx-auto mt-4">
                <el-input v-model="clientUrl" :disabled="clientInfo._id" size="large"
                    placeholder="Please enter the client url">
                    <template #append>
                        <i v-if="clientInfo._id" class="block i-ri-check-fill text-lg font-bold"></i>
                        <el-button v-else @click="submitClientUrl">Enter</el-button>
                    </template>
                </el-input>
            </div> -->
            <div v-if="clientInfo._id">
                <!-- 未激活，引到激活 -->
                <div v-if="clientInfo.state === 0">
                    <p>您的站点已创建，还未激活，请在您的client函数中填入以下配置信息：</p>
                    <p>serverUrl: {{ serverInfo.url }}</p>
                    <p>serverKey: {{ clientInfo.key }}</p>
                    <p><el-button @click="handlerActive" :loading="activeLoading">点击激活</el-button></p>
                </div>
                <!-- 已激活未生效，引到生效 -->
                <div v-if="clientInfo.state === 1">
                    <p>您的站点已激活，请设置触发器，开启心跳发送</p>
                    <p>1. xx</p>
                    <p>2. xx</p>
                    <p>state === 2 的配置表单</p>
                </div>
                <!-- 正常配置 -->
                <div v-if="[1, 2].includes(clientInfo.state)">
                    <p>配置表单</p>
                    <el-form>
                        <el-form-item label="sendUrl">
                            <el-input v-model="formData.sendUrl"></el-input>
                        </el-form-item>
                        <el-form-item label="errorMax">
                            <el-input v-model="formData.errorMax"></el-input>
                        </el-form-item>
                        <el-form-item label="noticeMax">
                            <el-input v-model="formData.noticeMax"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="handlerUpdate" :loading="updateLoading">update</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </template>
    </NuxtLayout>
</template>
<script setup>
const appStore = useAppStore()





const serverUrl = ref('')
const serverLoading = ref(false)
const serverInfo = ref({})

const clientUrl = ref('')
const clientLoading = ref(false)
const clientInfo = ref({})

const activeLoading = ref(false)
const updateLoading = ref(false)

const formData = ref({
    sendUrl: '',
    errorMax: 0,
    noticeMax: 0
})

const submitServerUrl = async () => {
    if (serverLoading.value) {
        return
    }
    try {
        const url = new URL(serverUrl.value)
        const startTime = Date.now()
        serverLoading.value = true
        const getServerInfo = await $fetch(`${url}`, {
            params: {
                action: 'getInfo'
            }
        })
        serverLoading.value = false
        if (getServerInfo.code !== 20000) {
            throw (new Error('server error'))
            return
        }
        serverInfo.value = {
            url,
            active: getServerInfo.data.active,
            count: getServerInfo.data.count,
            max: getServerInfo.data.max,
            delay: Date.now() - startTime
        }
    } catch (err) {
        serverLoading.value = false
        ElMessage({
            message: err.message,
            type: 'error'
        })
    }
}

const submitClientUrl = async () => {
    if (clientLoading.value) {
        return
    }
    try {
        const url = new URL(clientUrl.value)
        const exits = await $fetch(`${serverInfo.value.url}`, {
            method: 'POST',
            params: {
                action: 'fetch',
            },
            body: {
                clientUrl: url
            }
        })
        if (exits.code === 20000) {
            clientInfo.value = {
                ...exits.data
            }
        } else {
            ElMessageBox.confirm('Are you sure you want to register with the current server?', 'warning', {
                confirmButtonText: 'Yes',
                beforeClose: async (action, ctx, done) => {
                    if (action !== 'confirm') {
                        ctx.confirmButtonLoading = false
                        done()
                        return
                    }
                    ctx.confirmButtonLoading = true
                    $fetch(`${serverInfo.value.url}`, {
                        method: 'POST',
                        params: {
                            action: 'signup',
                        },
                        body: {
                            clientUrl: url
                        }
                    })
                        .then((res) => {
                            if (res.code !== 20000) {
                                throw (new Error('register fail'))
                                return
                            }
                            clientInfo.value = {
                                ...res.data
                            }
                            done()
                        })
                        .catch(() => {
                            throw (new Error('register fail'))
                            return
                        })
                        .finally(() => {
                            ctx.confirmButtonLoading = false
                        })
                }
            })
                .then(() => {
                })
                .catch(() => { })
        }
    } catch (err) {
        clientLoading.value = false
        ElMessage({
            message: err.message,
            type: 'error'
        })
    }

}

const handlerActive = async () => {
    if (activeLoading.value) {
        return
    }
    activeLoading.value = true
    $fetch(`${serverInfo.value.url}`, {
        method: 'POST',
        params: {
            action: 'active',
        },
        body: {
            id: clientInfo.value._id
        }
    })
        .then((res) => {
            if (res.code !== 20000) {
                ElMessage({
                    message: res.message || 'active fail',
                    type: 'error'
                })
                return
            }
            if (res.message) {
                ElMessage(res.message)
            }
            if (res.data) {
                clientInfo.value = {
                    ...res.data
                }
            }
        })
        .catch((err) => {
            ElMessage({
                message: err.message || 'active fail',
                type: 'error'
            })
            return
        })
        .finally(() => {
            activeLoading.value = false
        })

}
const handlerUpdate = () => {
    if (updateLoading.value) {
        return
    }
    let needUpdate = false
    Object.keys(formData.value).map((key) => {
        console.log('key', key, formData.value[key], clientInfo.value[key])
        if (formData.value[key] !== clientInfo.value[key]) {
            needUpdate = true
        }
    })
    if (!needUpdate) {
        ElMessage({
            message: "updated",
            type: 'success'
        })
        return
    }
    updateLoading.value = true
    $fetch(`${serverInfo.value.url}`, {
        method: 'POST',
        params: {
            action: 'update',
        },
        body: {
            id: clientInfo.value._id,
            payload: formData.value
        }
    })
        .then(res => {
            if (res.code !== 20000) {
                ElMessage({
                    message: err.message || '',
                    type: 'error'
                })
                return
            }
            if (res.message) {
                ElMessage({
                    message: res.message || '',
                    type: 'success'
                })
            }
            if (res.data) {
                clientInfo.value = {
                    ...res.data
                }
            }
        })
        .catch(err => {
            ElMessage({
                message: err.message || '',
                type: 'error'
            })
        })
        .finally(() => {
            updateLoading.value = false
        })
}
watchEffect(() => {
    formData.value.sendUrl = clientInfo.value.sendUrl || ''
})
watchEffect(() => {
    formData.value.errorMax = clientInfo.value.errorMax || 3
})
watchEffect(() => {
    formData.value.noticeMax = clientInfo.value.noticeMax || 3
})
</script>
<style>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>

<!--
 * @Author: NMTuan
 * @Email: NMTuan@qq.com
 * @Date: 2023-07-19 16:47:24
 * @LastEditTime: 2023-07-19 17:49:09
 * @LastEditors: NMTuan
 * @Description:
 * @FilePath: \laf_heartbeat\components\step\State2.vue
-->
<template>
    <div class="absolute w-full">
        <div class="mb-4" v-if="appStore.client.state === 1">
            <el-alert title="您的站点已激活，但似乎还没有过心跳，点击这里查看触发器设置。" type="warning" :closable="false" center />
        </div>
        <div class="flex items-center justify-center pb-4">
            <el-switch :value="!!appStore.client.paused" active-text="paused" inactive-text="active"
                :loading="pausedLoading" style="--el-switch-on-color: #ff4949; --el-switch-off-color: #13ce66"
                @change="togglePaused" />
        </div>
        <el-form label-width="auto" :disabled="appStore.client.paused">
            <el-form-item label="sendUrl">
                <el-input type="textarea" v-model="formData.sendUrl" rows="5"></el-input>
            </el-form-item>
            <el-form-item label="errorMax">
                <el-input v-model.number="formData.errorMax"></el-input>
            </el-form-item>
            <el-form-item label="noticeMax">
                <el-input v-model.number="formData.noticeMax"></el-input>
            </el-form-item>
            <el-form-item label=" ">
                <el-button @click="handlerUpdate" :loading="loading">update</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script setup>
const appStore = useAppStore()
const loading = ref(false)
const pausedLoading = ref(false)
const formData = ref({
    sendUrl: '',
    errorMax: 0,
    noticeMax: 0
})
const handlerUpdate = () => {
    // appStore.activeClient(loading)
    let needUpdate = false
    Object.keys(formData.value).map((key) => {
        if (formData.value[key] !== appStore.client[key]) {
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
    appStore.updateClient(formData.value)
}

const togglePaused = () => {
    appStore.togglePaused(pausedLoading)
}

watchEffect(() => {
    formData.value.sendUrl = appStore.client.sendUrl || ''
})
watchEffect(() => {
    formData.value.errorMax = appStore.client.errorMax || 3
})
watchEffect(() => {
    formData.value.noticeMax = appStore.client.noticeMax || 3
})
</script>

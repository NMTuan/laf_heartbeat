<!--
 * @Author: NMTuan
 * @Email: NMTuan@qq.com
 * @Date: 2023-07-19 16:47:24
 * @LastEditTime: 2023-07-19 21:48:05
 * @LastEditors: NMTuan
 * @Description:
 * @FilePath: \laf_heartbeat\components\step\State2.vue
-->
<template>
    <div class="p-8 pb-0 border-t border-t-solid border-gray-200">
        <div class="mb-4" v-if="appStore.client.state === 1">
            <el-alert title="您的站点已激活，但还没有收到过心跳请求。" type="warning" :closable="false" center />
        </div>
        <div class="flex items-center justify-center pb-4 relative">
            <div class="absolute right-0">
                <i class="block i-ri-delete-bin-line text-lg text-gray-400 cursor-pointer hover:bg-red-500"
                    @click="handlerRemove"></i>
            </div>
            <el-switch :value="!!appStore.client.paused" active-text="暂停服务" inactive-text="激活状态" :loading="pausedLoading"
                style="--el-switch-on-color: #ff4949; --el-switch-off-color: #13ce66" @change="togglePaused" />
        </div>
        <el-form label-position="top" size="large" :disabled="!!appStore.client.paused">
            <el-form-item label="最大错误次数">
                <el-tooltip content="超过1分钟的数据会被记录一次error，大于等于最大错误次数则会发起一次推送" placement="top-end" effect="light">
                    <el-input v-model.number="formData.errorMax"></el-input>
                </el-tooltip>
            </el-form-item>
            <el-form-item label="最大通知次数">
                <el-tooltip content="每次发起推送都会增加一次notice，大于等于最大通知次数则不再发起推送" placement="top-end" effect="light">
                    <el-input v-model.number="formData.noticeMax"></el-input>
                </el-tooltip>
            </el-form-item>
            <el-form-item label="通知推送地址">
                <el-tooltip content="程序会GET请求该地址，推荐使用plusPush、server酱、或其它自定义钩子" placement="top-end" effect="light">
                    <el-input type="textarea" v-model="formData.sendUrl" rows="5"></el-input>
                </el-tooltip>
            </el-form-item>
            <el-form-item label=" ">
                <el-button class="block w-full" type="primary" plain @click="handlerUpdate"
                    :loading="loading">更新配置</el-button>
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

const handlerRemove = () => {
    ElMessageBox.confirm('你确定要从当前服务器移除吗?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        beforeClose: async (action, ctx, done) => {
            if (action !== 'confirm') {
                ctx.confirmButtonLoading = false
                done()
                return
            }
            ctx.confirmButtonLoading = true
            appStore.removeClient()
                .then((res) => {
                    done()
                })
                .catch(() => { })
                .finally(() => {
                    ctx.confirmButtonLoading = false
                })
        }
    })
        .then(() => {
        })
        .catch(() => { })

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

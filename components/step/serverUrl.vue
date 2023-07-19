<!--
 * @Author: NMTuan
 * @Email: NMTuan@qq.com
 * @Date: 2023-07-19 15:10:27
 * @LastEditTime: 2023-07-19 21:30:04
 * @LastEditors: NMTuan
 * @Description: 
 * @FilePath: \laf_heartbeat\components\step\serverUrl.vue
-->
<template>
    <div class="p-8">
        <el-input v-model="serverUrl" :readonly="!!appStore.server.url" size="large"
            placeholder="请输入 Laf x HeartBeat Server 地址">
            <template #append>
                <div v-if="appStore.server.url" class="flex gap-4">
                    <span>延时: {{ appStore.server.delay }}ms</span>
                    <span>激活用户: {{ appStore.server.active }}</span>
                    <span>总用户: {{ appStore.server.count }}</span>
                    <span>最大用户: {{ appStore.server.max }}</span>
                </div>
                <el-button v-else :loading="loading" @click="submitServerUrl">确定</el-button>
            </template>
        </el-input>
    </div>
</template>
<script setup>
const appStore = useAppStore()
const serverUrl = ref('')
const loading = ref(false)

const submitServerUrl = async () => {
    if (loading.value) {
        return
    }
    try {
        const url = new URL(serverUrl.value)
        appStore.getServerInfo(serverUrl.value, loading)
    } catch (err) {
        ElMessage({
            message: err.message,
            type: 'error'
        })
    }
}

</script>

<!--
 * @Author: NMTuan
 * @Email: NMTuan@qq.com
 * @Date: 2023-07-19 15:10:27
 * @LastEditTime: 2023-07-19 17:44:02
 * @LastEditors: NMTuan
 * @Description: 
 * @FilePath: \laf_heartbeat\components\step\serverUrl.vue
-->
<template>
    <div class="absolute w-full">
        <el-input v-model="serverUrl" :disabled="appStore.server.url" size="large"
            placeholder="Please enter the server url">
            <template #append>
                <div v-if="appStore.server.url" class="flex gap-4">
                    <span>delay: {{ appStore.server.delay }}ms</span>
                    <span>active: {{ appStore.server.active }}</span>
                    <span>count: {{ appStore.server.count }}</span>
                    <span>max: {{ appStore.server.max }}</span>
                </div>
                <el-button v-else :loading="loading" @click="submitServerUrl">Enter</el-button>
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

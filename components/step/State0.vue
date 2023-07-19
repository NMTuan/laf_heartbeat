<!--
 * @Author: NMTuan
 * @Email: NMTuan@qq.com
 * @Date: 2023-07-19 16:47:24
 * @LastEditTime: 2023-07-19 17:06:02
 * @LastEditors: NMTuan
 * @Description:
 * @FilePath: \laf_heartbeat\components\step\State0.vue
-->
<template>
    <div class="absolute w-full">
        <p>请在您的 client 云函数中配置以下信息，并尝试激活</p>
        <p>
            <el-input :value="appStore.server.url" readonly>
                <template #prepend>
                    heartBeatConfig . serverUrl
                </template>
            </el-input>
        </p>
        <p>
            <el-input :value="appStore.client.key" readonly>
                <template #prepend>
                    heartBeatConfig . serverKey
                </template>
            </el-input>
        </p>
        <p><el-button @click="handlerActive" :loading="loading">点击激活</el-button></p>
    </div>
</template>
<script setup>
const appStore = useAppStore()
const loading = ref(false)
const handlerActive = () => {
    appStore.activeClient(loading)
}
</script>

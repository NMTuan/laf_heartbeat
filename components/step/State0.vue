<!--
 * @Author: NMTuan
 * @Email: NMTuan@qq.com
 * @Date: 2023-07-19 16:47:24
 * @LastEditTime: 2023-07-20 10:56:53
 * @LastEditors: NMTuan
 * @Description:
 * @FilePath: \laf_heartbeat\components\step\State0.vue
-->
<template>
    <div class="p-8 border-t border-t-solid border-gray-200">
        <div class="mb-4">
            <el-alert title="请在您的 client 云函数中配置以下信息，并尝试激活。" type="info" :closable="false" center />
        </div>
        <el-form size="large" label-position="top">
            <el-form-item label="heartBeatConfig.serverUrl">
                <el-input :value="appStore.server.url" readonly> </el-input>
            </el-form-item>
            <el-form-item label="heartBeatConfig.serverKey">
                <el-input :value="appStore.client.key" readonly> </el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="block w-full" type="primary" plain @click="handlerActive"
                    :loading="loading">点击激活</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script setup>
const appStore = useAppStore()
const loading = ref(false)
const handlerActive = () => {
    appStore.activeClient(loading)
}
</script>

<!--
 * @Author: NMTuan
 * @Email: NMTuan@qq.com
 * @Date: 2023-07-19 09:40:32
 * @LastEditTime: 2023-07-19 21:45:58
 * @LastEditors: NMTuan
 * @Description: 
 * @FilePath: \laf_heartbeat\pages\index.vue
-->
<template>
    <NuxtLayout>
        <h1 class="text-center mb-6 ml-6.5 flex items-center justify-center pt-6%">
            <span>Laf x HeartBeat</span>
            <sup>
                <el-tooltip content="Laf 心跳服务配置工具" placement="right" effect="light">
                    <i class="block i-ri-question-line text-lg mb-8 ml-2 text-gray-400 cursor-pointer"></i>
                </el-tooltip>
            </sup>
        </h1>
        <StepServerUrl></StepServerUrl>
        <StepClientUrl v-if="appStore.server.url"></StepClientUrl>
        <StepState0 v-if="appStore.client.state === 0"></StepState0>
        <StepState2 v-if="[1, 2].includes(appStore.client.state)"></StepState2>
    </NuxtLayout>
</template>
<script setup>
const appStore = useAppStore()
</script>

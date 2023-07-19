<!--
 * @Author: NMTuan
 * @Email: NMTuan@qq.com
 * @Date: 2023-07-19 09:40:32
 * @LastEditTime: 2023-07-19 17:51:44
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
    </NuxtLayout>
</template>
<script setup>
const appStore = useAppStore()
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

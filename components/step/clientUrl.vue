<!--
 * @Author: NMTuan
 * @Email: NMTuan@qq.com
 * @Date: 2023-07-19 16:07:55
 * @LastEditTime: 2023-07-19 17:00:46
 * @LastEditors: NMTuan
 * @Description: 
 * @FilePath: \laf_heartbeat\components\step\clientUrl.vue
-->
<template>
    <div class="absolute w-full">
        <el-input v-model="clientUrl" :disabled="appStore.client._id" size="large"
            placeholder="Please enter the client url">
            <template #append>
                <i v-if="appStore.client._id" class="block i-ri-check-fill text-lg font-bold"></i>
                <el-button v-else @click="submitClientUrl">Enter</el-button>
            </template>
        </el-input>
    </div>
</template>
<script setup>
const appStore = useAppStore()
const clientUrl = ref('')
const submitClientUrl = async () => {
    try {
        const url = new URL(clientUrl.value)
        const exits = await appStore.checkClientState(clientUrl.value)
        if (exits.code === 20000) {
            return
        }
        ElMessageBox.confirm('Are you sure you want to register with the current server?', 'warning', {
            confirmButtonText: 'Yes',
            beforeClose: async (action, ctx, done) => {
                if (action !== 'confirm') {
                    ctx.confirmButtonLoading = false
                    done()
                    return
                }
                ctx.confirmButtonLoading = true
                appStore.signupClient(clientUrl.value)
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
    } catch (err) {
        ElMessage({
            message: err.message,
            type: 'error'
        })
    }

}
</script>

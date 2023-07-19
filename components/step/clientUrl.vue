<!--
 * @Author: NMTuan
 * @Email: NMTuan@qq.com
 * @Date: 2023-07-19 16:07:55
 * @LastEditTime: 2023-07-19 20:31:57
 * @LastEditors: NMTuan
 * @Description: 
 * @FilePath: \laf_heartbeat\components\step\clientUrl.vue
-->
<template>
    <div class="p-8 border-t border-t-solid border-gray-200">
        <el-input v-model="clientUrl" :readonly="!!appStore.client._id" size="large"
            placeholder="请输入 Laf x HeartBeat Client 地址">
            <template #append>
                <i v-if="appStore.client._id" class="block i-ri-check-fill text-lg font-bold"></i>
                <el-button v-else @click="submitClientUrl" :loading="loading">确定</el-button>
            </template>
        </el-input>
    </div>
</template>
<script setup>
const appStore = useAppStore()
const loading = ref(false)
const clientUrl = ref('')
const submitClientUrl = async () => {
    try {
        const url = new URL(clientUrl.value)
        const exits = await appStore.checkClientState(clientUrl.value, loading)
        if (exits.code === 20000) {
            return
        }
        ElMessageBox.confirm('你确定要注册到当前服务器吗?', '提示', {
            cancelButtonText: '取消',
            confirmButtonText: '确定',
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
            .then(() => { })
            .catch(() => { })
    } catch (err) {
        ElMessage({
            message: err.message,
            type: 'error'
        })
    }

}
</script>

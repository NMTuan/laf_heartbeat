/*
 * @Author: NMTuan
 * @Email: NMTuan@qq.com
 * @Date: 2023-06-27 15:59:25
 * @LastEditTime: 2023-07-19 16:39:45
 * @LastEditors: NMTuan
 * @Description:
 * @FilePath: \laf_heartbeat\composables\request.js
 */
export const request = (params, loading) => {
    const defaultParams = {
        url: undefined,
        method: 'GET',
        query: {},
        body: {}
    }

    params = { ...defaultParams, ...params }
    const url = params.url
    delete params.url

    // get请求不需要body
    if (params.method === 'GET') {
        delete params.body
    }

    return new Promise((resolve, reject) => {
        if (loading) {
            if (loading.value) {
                return resolve()
            }
            loading.value = true
        }
        $fetch(url, params)
            .then((res) => {
                if (res.code === 20000) {
                    if (res.message) {
                        ElMessage({
                            message: res.message,
                            type: 'success'
                        })
                    }
                    resolve(res)
                } else {
                    if (res.message) {
                        ElMessage({
                            message: res.message,
                            type: 'error'
                        })
                    }
                    resolve(res)
                }
            })
            .catch((err) => {
                if (err.response) {
                    ElMessage({
                        message:
                            // err.response.data ||
                            // err.response.statusText ||
                            err.response._data,
                        type: 'error'
                    })
                }
                reject(err)
            })
            .finally(() => {
                if (loading) {
                    loading.value = false
                }
            })
    })
}

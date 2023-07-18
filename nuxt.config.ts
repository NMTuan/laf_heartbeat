/*
 * @Author: NMTuan
 * @Email: NMTuan@qq.com
 * @Date: 2023-07-18 20:55:06
 * @LastEditTime: 2023-07-19 06:13:45
 * @LastEditors: NMTuan
 * @Description:
 * @FilePath: \laf_heartbeat\nuxt.config.ts
 */
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    devtools: { enabled: true },
    css: ['@unocss/reset/normalize.css'],
    modules: ['@unocss/nuxt', '@pinia/nuxt', '@element-plus/nuxt'],
    experimental: {
        viewTransition: true
    },
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@use "@/assets/scss/element/index.scss" as element;`
                }
            }
        }
    },
    elementPlus: {
        // icon: 'ElIcon',
        importStyle: 'scss'
        // themes: ['dark']
    },
    spaLoadingTemplate: false
})

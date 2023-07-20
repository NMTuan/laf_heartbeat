/*
 * @Author: NMTuan
 * @Email: NMTuan@qq.com
 * @Date: 2023-07-18 20:55:06
 * @LastEditTime: 2023-07-20 10:47:27
 * @LastEditors: NMTuan
 * @Description:
 * @FilePath: \laf_heartbeat\nuxt.config.ts
 */
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    app: {
        head: {
            script: [
                {
                    src: 'https://hm.baidu.com/hm.js?aa6df47258f76084306dfa2577fc72d9'
                }
            ]
        }
    },

    devtools: { enabled: false },
    css: ['@unocss/reset/normalize.css'],
    modules: ['@unocss/nuxt', '@pinia/nuxt', '@element-plus/nuxt'],
    experimental: {
        viewTransition: true
    },
    imports: {
        dirs: ['stores']
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

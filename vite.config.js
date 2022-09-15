import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VitePluginHtmlEnv from 'vite-plugin-html-env'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, __dirname)
  console.log('mode:' + mode + '.env:' + JSON.stringify(env))
  var base = ''
  if(mode !== 'development') base = '/static/'
  return{
    base: base,
    plugins: [vue(), vueJsx(), VitePluginHtmlEnv()],
    publicDir: 'static',
    build: {
      outDir: '../mvc/web/src/main/resources/static',
      assetsDir: 'js',
      emptyOutDir: true
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})

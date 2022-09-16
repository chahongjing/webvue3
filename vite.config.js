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
  var proxy = null
  if(mode !== 'development') {
    base = '/static/'
  } else {
    proxy = {}
    var reg = new RegExp("^" + env.VITE_PROXY_PREFIX)
    proxy[env.VITE_PROXY_PREFIX] = {
      target: env.VITE_SERVER_URL + ':' + env.VITE_SERVER_PORT,
      changeOrigin: true,
      rewrite: (path) => path.replace(reg, '')
    }
    console.log("proxy:" + JSON.stringify(proxy))
  }

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
    },
    server: {
      proxy: proxy
    }
  }
})

import path from 'path'
import { defineConfig, splitVendorChunkPlugin  } from 'vite'
import externalGlobals from 'rollup-plugin-external-globals'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

let globals = externalGlobals({
  // axios: 'axios',
});

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "~/styles/element/index.scss" as *;`,
      },
    },
  },
  plugins: [
    vue(),
    vueJsx(),
    splitVendorChunkPlugin(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass',
        }),
      ],
    }),
  ],
  build: {
    rollupOptions: {
      external: [],
      plugins: [globals]
    },
  },
  // server: {
  //   proxy: {
  //     "/api": {
  //       target: "http://127.0.0.1:3000/api/",
  //       changeOrigin: true,
  //     },
  //   },
  // },
})
